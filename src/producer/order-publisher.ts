import { BasePublisher } from "./base-publisher";
import {OrderEvent } from "../events/order-events";

/**
 * Publisher implementation for Order events.
 * Specifically handles publishing to the 'order.created' queue.
 */
export class OrderPublisher extends BasePublisher<OrderEvent> {
  /** The queue specific to order creation events */
  queue: string = 'order.created';

  /**
   * Publishes an order event to the queue.
   * Ensures the event has a timestamp before publishing.
   * 
   * @param event - The order event data to publish
   */
  async publish(event: OrderEvent): Promise<void> {
    const eventWithTimestamp: OrderEvent = {
      ...event,
      timestamp: event.timestamp || new Date(),
    };

    await super.publish(eventWithTimestamp);
  }
}
