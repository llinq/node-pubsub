import { RabbitMQClient } from "../infra/rabbit/RabbitMQClient";

/**
 * Abstract base class for all publishers
 * Encapsulates RabbitMQ client initialization and common publishing logic
 * 
 * @example
 * ```typescript
 * class OrderPublisher extends BasePublisher<OrderEvent> {
 *   async publish(event: OrderEvent): Promise<void> {
 *     await super.publish(event, 'orders');
 *   }
 * }
 * ```
 */
export abstract class BasePublisher<T extends object> {
  protected client: RabbitMQClient;
  private initialized: boolean = false;

  constructor() {
    this.client = new RabbitMQClient();
  }

  /**
   * Initialize the RabbitMQ connection
   * Called automatically on first publish, but can be called manually
   */
  async initialize(): Promise<void> {
    if (!this.initialized) {
      await this.client.initialize();
      this.initialized = true;
    }
  }

  /**
   * Publish an event to RabbitMQ
   * Automatically initializes the connection if not already done
   * 
   * @param event - The event payload to publish
   */
  async publish(event: T): Promise<void> {
    await this.initialize();

    await this.client.publish(this.queue, event);
  }

  /**
   * Close the RabbitMQ connection
   * Should be called when the publisher is no longer needed
   */
  async close(): Promise<void> {
    // RabbitMQClient doesn't have a close method yet, but we prepare for it
    this.initialized = false;
  }

    /**
   * Get the queue name for this publisher
   * Must be implemented by concrete publisher classes
   */
  abstract queue: string;
}
