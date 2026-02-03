import amqp, { ChannelModel, Channel } from "amqplib";
import { rabbitConfig } from "../../config/rabbit";

export class RabbitMQClient {
  private connection!: ChannelModel;
  private channel!: Channel;

  async connect() {
    this.connection = await amqp.connect(rabbitConfig.url);
    this.channel = await this.connection.createChannel();
  }

  async setup(exchange: string, queue: string, routingKey: string) {
    await this.channel.assertExchange(exchange, "topic", { durable: true });
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(queue, exchange, routingKey);
  }

  async publish(exchange: string, routingKey: string, message: object) {
    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  }

  async consume(queue: string, handler: (msg: any) => Promise<void>) {
    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        await handler(content);
        this.channel.ack(msg);
      } catch (error) {
        console.error("Erro ao processar fila", error);
        this.channel.nack(msg, false, false);
      }
    });
  }
}
