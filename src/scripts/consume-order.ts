import { OrderConsumer } from "../consumer/order-consumer";
import { OrderEvent } from "../events/order-events";

/**
 * Script to consume order events
 * Usage: ts-node src/scripts/consume-orders.ts
 */
async function consumeOrders() {
  const consumer = new OrderConsumer();

  try {
    console.log('Starting order consumer...');
    console.log('Waiting for order events...\n');

    await consumer.consume(async (event: OrderEvent) => {
      console.log('Processing order:', {
        orderId: event.orderId,
        total: `$${event.total}`,
        timestamp: event.timestamp
      });

      // TODO - Save to database
      
      console.log(`Order ${event.orderId} processed successfully\n`);
    });
  } catch (error) {
    console.error('Error consuming orders:', error);
    process.exit(1);
  }
}

consumeOrders();
