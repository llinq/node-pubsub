import { RabbitMQClient } from "../infra/rabbit/RabbitMQClient";
import { rabbitConfig } from "../config/rabbit";

async function consume() {
  const rabbit = new RabbitMQClient();

  await rabbit.connect();
  await rabbit.setup(
    rabbitConfig.exchange,
    rabbitConfig.queue,
    rabbitConfig.routingKey,
  );

  await rabbit.consume(rabbitConfig.queue, async (event) => {
    console.log("Evento recebido", event);
  });
}

consume();