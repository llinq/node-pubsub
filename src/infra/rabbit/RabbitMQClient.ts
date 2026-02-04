import amqp, { ChannelModel, Channel } from "amqplib";
import { rabbitConfig } from "../../config/rabbit";

export class RabbitMQClient {
  private connection!: ChannelModel;
  private channel!: Channel;

  async initialize() {
    await this.connect();
    await this.setup(
      rabbitConfig.exchange,
      rabbitConfig.queue,
      rabbitConfig.routingKey
    );
  }


  private async connect() {
    this.connection = await amqp.connect(rabbitConfig.url);
    this.channel = await this.connection.createChannel();
  }

  private async setup(exchange: string, queue: string, routingKey: string) {
    await this.channel.assertExchange(exchange, "topic", { durable: true });
    
    const delayQueue = `${queue}.delay`;
    const delayExchange = `${exchange}.delay`;
    
    await this.channel.assertExchange(delayExchange, "direct", { durable: true });
    
    await this.channel.assertQueue(delayQueue, {
      durable: true,
      deadLetterExchange: exchange,
      deadLetterRoutingKey: routingKey,
      messageTtl: 5000
    });
    
    await this.channel.assertQueue(queue, { durable: true });
    
    await this.channel.bindQueue(delayQueue, delayExchange, routingKey);
    await this.channel.bindQueue(queue, exchange, routingKey);
  }

  async publish(exchange: string, routingKey: string, message: object, delay: boolean = true) {
    const targetExchange = delay ? `${exchange}.delay` : exchange;
    
    this.channel.publish(
      targetExchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  }

  async consume(queue: string, handler: (msg: any) => Promise<void>) {
    await this.channel.prefetch(1);
    
    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        await handler(content);
        this.channel.ack(msg);
      } catch (error) {
        console.error("Error processing queue", error);
        this.channel.nack(msg, false, false);
      }
    });
  }
}
