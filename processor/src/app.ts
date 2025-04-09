import { RabbitMQService } from "./services/rabbitmq";
import { logger } from "./services/logger";
import { config } from "./config";
import { processMessage } from "./services/messageProcessor";

async function startConsumer() {
  const rabbitmq = new RabbitMQService();

  try {
    await rabbitmq.connect();
    logger.info("Connected to RabbitMQ");

    await rabbitmq.consume(async (message) => {
      try {
        await processMessage(message);
        logger.info("Message processed successfully");
      } catch (error) {
        logger.error("Error processing message:", error);
        throw error;
      }
    });

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      logger.info("Shutting down...");
      await rabbitmq.close();
      process.exit(0);
    });
  } catch (error) {
    logger.error("Failed to start consumer:", error);
    process.exit(1);
  }
}

startConsumer();
