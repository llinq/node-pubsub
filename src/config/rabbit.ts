export const rabbitConfig = {
  url: "amqp://guest:guest@localhost:5672",
  exchange: "orders",
  routingKey: "order.created",
  queue: "order.created.queue",
};
