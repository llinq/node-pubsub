import express, { Request, Response } from "express";
import { RabbitMQClient } from "../infra/rabbit/RabbitMQClient";
import { rabbitConfig } from "../config/rabbit";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const rabbit = new RabbitMQClient();

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/api/orders", async (req: Request, res: Response) => {
  try {
    const { orderId, total, items } = req.body;

    if (!orderId || !total) {
      return res.status(400).json({
        error: "orderId and total are required",
      });
    }

    const event = {
      orderId,
      total,
      items: items || [],
      createdAt: new Date().toISOString(),
    };

    await rabbit.publish(rabbitConfig.exchange, rabbitConfig.routingKey, event);

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

app.post("/api/publish", async (req: Request, res: Response) => {
  try {
    const { exchange, routingKey, message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const targetExchange = exchange || rabbitConfig.exchange;
    const targetRoutingKey = routingKey || rabbitConfig.routingKey;

    await rabbit.publish(targetExchange, targetRoutingKey, message);

    res.status(201).json({
      message: "Message published to queue successfully",
      data: {
        exchange: targetExchange,
        routingKey: targetRoutingKey,
        message,
      },
    });
  } catch (error) {
    console.error("Error publishing to queue:", error);
    res.status(500).json({
      error: "Error publishing message to queue",
    });
  }
});

async function start() {
  try {
    await rabbit.initialize();
    console.log("Connected to RabbitMQ");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Publish order: POST http://localhost:${PORT}/api/orders`);
      console.log(`Publish message: POST http://localhost:${PORT}/api/publish`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

start();
