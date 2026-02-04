import { RabbitMQClient } from "../infra/rabbit/RabbitMQClient";
import { rabbitConfig } from "../config/rabbit";

async function consume() {
  const rabbit = new RabbitMQClient();

  await rabbit.initialize();

  await rabbit.consume(rabbitConfig.queue, async (event) => {
    console.log("Event received", event);
  });
}

consume();