import { v4 as uuidv4 } from "uuid";

/**
 * Script to bulk publish orders to the API.
 * Useful for load testing and generating traffic.
 * 
 * Environment Variables:
 * - API_URL: The URL of the API (default: http://localhost:3000)
 * - BATCH_SIZE: Number of orders to publish (default: 1000)
 */
const API_URL = process.env.API_URL || "http://localhost:3000";
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "1000");

interface OrderPayload {
  orderId: string;
  total: number;
}

function generateRandomTotal(): number {
  return Math.floor(Math.random() * 100) + 1;
}

function generateOrder(): OrderPayload {
  return {
    orderId: uuidv4(),
    total: generateRandomTotal(),
  };
}

async function publishOrder(order: OrderPayload): Promise<void> {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to publish order: ${error}`);
  }

  const result = await response.json();
  console.log(`Published order ${order.orderId} - Total: $${order.total}`);
}

async function bulkPublish(batchSize: number): Promise<void> {
  console.log(`Starting bulk publish of ${batchSize} orders...`);
  console.log(`Target API: ${API_URL}`);
  console.log("");

  const startTime = Date.now();
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < batchSize; i++) {
    try {
      const order = generateOrder();
      await publishOrder(order);
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`Error publishing order ${i + 1}:`, error);
    }
  }

  const duration = Date.now() - startTime;

  console.log("");
  console.log("Summary:");
  console.log(`Total orders: ${batchSize}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
  console.log(`Duration: ${duration}ms`);
  console.log(`Average: ${(duration / batchSize).toFixed(2)}ms per order`);
}

bulkPublish(BATCH_SIZE).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
