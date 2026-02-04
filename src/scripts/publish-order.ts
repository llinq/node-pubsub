import { OrderEvent } from "../events/order-events";
import { OrderPublisher } from "../producer/order-publisher";
import crypto from "crypto";

/**
 * Script to publish a single order event
 * Usage: ts-node src/scripts/publish-order.ts
 */
async function publishOrder() {
  const publisher = new OrderPublisher();

  try {
    const event: OrderEvent = {
      orderId: crypto.randomUUID(),
      total: 99.9,
      timestamp: new Date(),
    };

    console.log('Publishing order event:', event);
    await publisher.publish(event);
    console.log('Order event published successfully!');
  } catch (error) {
    console.error('Error publishing order:', error);
    process.exit(1);
  }
}

publishOrder();
