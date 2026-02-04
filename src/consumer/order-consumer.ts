import { BaseConsumer, ConsumerHandler } from "./base-consumer";
import { OrderEvent } from "../events/order-events";

/**
 * Consumer handler function type
 */
export type OrderEventHandler = ConsumerHandler<OrderEvent>;

/**
 * Consumer implementation for Order events.
 * Listens for messages on the 'order.created' queue.
 */
export class OrderConsumer extends BaseConsumer<OrderEvent> {
  /** The queue to consume from */
  queue: string = 'order.created';

  /**
   * Starts the consumer to listen for order events.
   * 
   * @param handler - callback function to execute when an order event is received
   */
  async consume(handler: OrderEventHandler): Promise<void> {
    await super.consume(handler);
  }

  /**
   * Intercepts order events for logging purposes before passing them to the handler.
   * 
   * @param event - The received order event
   * @param handler - The business logic handler
   */
  protected async onMessage(event: OrderEvent, handler: OrderEventHandler): Promise<void> {
    console.log(`[OrderConsumer] Received event:`, {
      orderId: event.orderId,
      total: event.total,
      timestamp: event.timestamp
    });

    await handler(event);
  }
}
