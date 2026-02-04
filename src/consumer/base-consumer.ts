import { RabbitMQClient } from "../infra/rabbit/RabbitMQClient";

/**
 * Consumer handler function type
 */
export type ConsumerHandler<T> = (event: T) => Promise<void>;

/**
 * Abstract base class for all consumers
 * Encapsulates RabbitMQ client initialization and common consuming logic
 */
export abstract class BaseConsumer<T extends object> {
  protected client: RabbitMQClient;
  private initialized: boolean = false;

  constructor() {
    this.client = new RabbitMQClient();
  }

  /**
   * Initialize the RabbitMQ connection
   * Called automatically on first consume, but can be called manually
   */
  async initialize(): Promise<void> {
    if (!this.initialized) {
      await this.client.initialize();
      this.initialized = true;
    }
  }

  /**
   * Start consuming events from the queue
   * 
   * @param handler - Function to handle each received event
   */
  async consume(handler: ConsumerHandler<T>): Promise<void> {
    await this.initialize();

    await this.client.consume(this.queue, async (event) => {
      await this.onMessage(event, handler);
    });
  }

  /**
   * Internal message handler wrapper.
   * Allows derived classes to customize message handling (e.g., logging, error handling)
   * before invoking the actual business logic handler.
   * 
   * @param event - The deserialized event payload
   * @param handler - The business logic handler function
   */
  protected async onMessage(event: T, handler: ConsumerHandler<T>): Promise<void> {
    await handler(event);
  }

  /**
   * Get the queue name for this consumer
   * Must be implemented by concrete consumer classes
   */
  abstract queue: string;
}
