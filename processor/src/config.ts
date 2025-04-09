import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const config = {
  rabbitmq: {
    url: process.env.RABBITMQ_URL || "amqp://localhost:5672",
    queueName: process.env.RABBITMQ_QUEUE_NAME || "expense_queue",
    prefetchCount: parseInt(process.env.RABBITMQ_PREFETCH_COUNT || "10", 10),
  },
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
  },
  database: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/expense_tracker",
  },
  app: {
    name: "expense-processor",
    environment: process.env.NODE_ENV || "development",
    logLevel: process.env.LOG_LEVEL || "info",
  },
  // Add more configuration sections as needed
  // database: { ... },
  // notifications: { ... },
  // etc.
};
