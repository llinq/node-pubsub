import { RabbitMQClient } from "../infra/rabbit/RabbitMQClient";
import { rabbitConfig } from "../config/rabbit";
import crypto from "crypto";

async function publish() {
  const rabbit = new RabbitMQClient();

  await rabbit.initialize();

  const event = {
    orderId: crypto.randomUUID(),
    total: 99.9,
  };

  await rabbit.publish(rabbitConfig.exchange, rabbitConfig.routingKey, event);
}

publish();