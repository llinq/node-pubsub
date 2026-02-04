import { Channel, ChannelModel } from "amqplib";
import amqp from "amqplib";
import { rabbitConfig } from "../../config/rabbit";

/**
 * Singleton-like client for RabbitMQ interactions.
 * Handles connection, channel creation, queue setup, publishing, and consuming.
 */
export class RabbitMQClient {
  private connection!: ChannelModel;
  private channel!: Channel;

  /**
   * Initializes the RabbitMQ client.
   * Connects to the server and sets up necessary queues.
   */
  async initialize() {
    await this.connect();
    await this.setup(["order.created"]);
  }

  /**
   * Establishes a connection to the RabbitMQ server and creates a channel.
   * Uses configuration from rabbitConfig.
   */
  private async connect() {
    this.connection = await amqp.connect(rabbitConfig.url);
    this.channel = await this.connection.createChannel();
  }

  /**
   * Asserts the existence of specified queues.
   * 
   * @param queues - Array of queue names to assert
   */
  private async setup(queues: string[]) {
    for(const queue of queues) {
      await this.channel.assertQueue(queue, { durable: true });
    }
  }

  /**
   * Publishes a message to a specific queue.
   * The message is converted to JSON and sent as a Buffer.
   * 
   * @param queue - The name of the queue to publish to
   * @param message - The message object to be published
   */
  async publish(queue: string, message: object) {
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {persistent: true});
  }

  /**
   * Consumes messages from a specific queue.
   * 
   * @param queue - The name of the queue to consume from
   * @param handler - Callback function to process the received message
   */
  async consume(queue: string, handler: (msg: any) => Promise<void>) {
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
