import express, { Request, Response } from "express";
import { OrderPublisher } from "../producer/order-publisher";
import { OrderEvent } from "../events/order-events";

/**
 * Express API server entry point.
 * Provides endpoints for creating orders which are published to RabbitMQ.
 */
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const orderPublisher = new OrderPublisher();

/**
 * Health check endpoint.
 */
app.get("/health", (_: Request, res: Response) => {
  res.json({ status: "ok" });
});

/**
 * Endpoint to create a new order.
 * Publishes an OrderEvent to the queue.
 */
app.post("/api/orders", async (req: Request, res: Response) => {
  try {
    const { orderId, total, userId } = req.body;

    if (!orderId || !total) {
      return res.status(400).json({
        error: "orderId and total are required",
      });
    }

    const event: OrderEvent = {
      orderId,
      total,
      userId,
      timestamp: new Date(),
    };

    await orderPublisher.publish(event);

    res.status(201).json({
      message: "Order published to queue successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error publishing to queue:", error);
    res.status(500).json({
      error: "Error publishing order to queue",
    });
  }
});

async function start() {
  try {
    // Initialize publishers and clients
    await orderPublisher.initialize();
    console.log("Connected to RabbitMQ");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Publish order: POST http://localhost:${PORT}/api/orders`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

start();
