import amqp from "amqplib";
import dotenv from "dotenv";
import { processMessage } from "./services/messageProcessor";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE_NAME = process.env.QUEUE_NAME || "expense_queue";

async function startConsumer() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    console.log(
      `[*] Waiting for messages in ${QUEUE_NAME}. To exit press CTRL+C`
    );

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        try {
          const content = msg.content.toString();
          console.log(`[x] Received ${content}`);

          await processMessage(content);
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);
          // Reject the message and requeue it
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error("Error starting consumer:", error);
    process.exit(1);
  }
}

startConsumer();
