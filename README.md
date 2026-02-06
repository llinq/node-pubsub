# Node Pub/Sub

Study project focused on Node.js with TypeScript and event-driven architecture using RabbitMQ.

## Features

- **Class-Based Architecture**: Robust implementation of abstract Publishers and Consumers.
- **RabbitMQ**: Full integration with exchanges, queues, and dead letter queues.
- **REST API**: Express server to create orders via HTTP.
- **Automation Scripts**: Tools for load testing and manual pub/sub.
- **Tutorials**: [Practical examples](https://www.rabbitmq.com/tutorials)

## Prerequisites

1.  **Node.js**
2.  **Docker** & **Docker Compose** (to run RabbitMQ)

## Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start RabbitMQ:
    ```bash
    docker-compose up -d
    ```

## How to Use

### 1. Hello World
Quick test to verify RabbitMQ connection.

- **Receive messages:**
  ```bash
  npm run hello:receive
  ```
- **Send messages:**
  ```bash
  npm run hello:send
  ```

### 2. Work Queues
Distribute time-consuming tasks among multiple workers.

- **Start Worker:**
  ```bash
  npm run work:worker
  ```
- **Send New Task:**
  ```bash
  npm run work:new_task -- "My Task..."
  ```
- **Send Multiple Tasks:**
  ```bash
  npm run work:send_tasks
  ```

### 3. Publish/Subscribe
Broadcast messages to multiple consumers (logging).

- **Receive Logs:**
  ```bash
  npm run log:receive
  ```
- **Emit Log:**
  ```bash
  npm run log:emit -- "Log info..."
  ```

### 4. Routing
Subscribe only to a subset of messages (e.g. only critical errors).

- **Receive Logs (info, warning):**
  ```bash
  npm run log:receive:direct -- info warning
  ```
- **Emit Log (error):**
  ```bash
  npm run log:emit:direct -- error "Run. Run. Or it will explode."
  ```

### 5. Topics
Receive messages based on a pattern (topics).

- **Receive (all logs):**
  ```bash
  npm run log:receive:topic -- "#"
  ```
- **Receive (kernel logs):**
  ```bash
  npm run log:receive:topic -- "kern.*"
  ```
- **Emit Log:**
  ```bash
  npm run log:emit:topic -- "kern.critical" "A critical kernel error"
  ```

### 6. RPC (Remote Procedure Call)
Request/reply pattern for remote procedure calls.

- **Start Server:**
  ```bash
  npm run rpc:server
  ```
- **Send Request:**
  ```bash
  npm run rpc:client -- <number>
  ```
  Example: `npm run rpc:client -- 30`

### 7. Order System
Complete simulation of an order creation flow.

#### A. Run the Consumer
Starts the service listening to the `order.created` queue.
```bash
npm run order:consume
```

#### B. Publish an Order (Manual)
Sends a single order event to the queue.
```bash
npm run order:publish
```

#### C. Load Test (Bulk)
Publishes multiple orders at once to test processing.
```bash
# Publishes 1000 orders (default)
npm run order:bulk
```

### 8. REST API
Starts the Express server to receive orders via HTTP.

1.  Start the API:
    ```bash
    npm run api
    ```

2.  Create an order (curl example):
    ```bash
    curl -X POST http://localhost:3000/api/orders \
         -H "Content-Type: application/json" \
         -d '{"orderId": "123", "total": 99.90, "userId": "user_01"}'
    ```

## Monitoring

Access the RabbitMQ management dashboard:

- **URL:** [http://localhost:15672](http://localhost:15672)
- **User:** `guest`
- **Password:** `guest`

## Project Structure

- **`src/api`**: Express server.
- **`src/consumer`**: Consumer logic (Base + Implementations).
- **`src/producer`**: Publisher logic (Base + Implementations).
- **`src/events`**: Event type definitions and interfaces.
- **`src/infra`**: RabbitMQ configuration and client.
- **`src/scripts`**: Utility scripts for manual testing.
- **`src/tutorials`**: Introductory examples.

---
_Project for study purposes._
