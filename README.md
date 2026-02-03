# Node Pub/Sub

Projeto de testes para brincar com Node.js e filas RabbitMQ.

## O que é?

Um playground simples para experimentar com:
- **Node.js** + TypeScript
- **RabbitMQ** (sistema de mensageria)
- Padrão Dead Letter Queue (DLQ)

## Como usar

### 1. Subir o RabbitMQ

```bash
docker-compose up -d
```

### 2. Rodar o consumer

```bash
npm run consumer
```

### 3. Enviar uma mensagem

Em outro terminal:

```bash
npm run producer
```

## O que acontece?

- O **producer** envia uma mensagem para a fila `order.created.queue`
- O **consumer** recebe e processa a mensagem
- Se houver erro, a mensagem vai direto para a DLQ (Dead Letter Queue)

## Acessar o painel do RabbitMQ

Abra no navegador: http://localhost:15672

- **Usuário:** guest
- **Senha:** guest

---

_Projeto criado apenas para estudos e testes._
