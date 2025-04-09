import amqp, { Channel, Connection, Message, ChannelModel } from "amqplib";
import { config } from "../config";
import { logger } from "../utils/logger";

export class RabbitMQService {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  async connect(): Promise<void> {
    try {
      const conn = await amqp.connect(config.rabbitmq.url);
      this.connection = conn as unknown as Connection;

      if (!this.connection) {
        throw new Error("Failed to establish RabbitMQ connection");
      }

      this.channel = (await (
        this.connection as any
      ).createChannel()) as Channel;
      if (!this.channel) {
        throw new Error("Failed to create RabbitMQ channel");
      }

      await this.channel.assertQueue(config.rabbitmq.queueName, {
        durable: true,
      });

      await this.channel.prefetch(config.rabbitmq.prefetchCount);

      logger.info("Connected to RabbitMQ");
    } catch (error) {
      logger.error("Failed to connect to RabbitMQ:", error);
      throw error;
    }
  }

  async consume(callback: (message: any) => Promise<void>): Promise<void> {
    if (!this.channel) {
      throw new Error("Channel not initialized");
    }

    try {
      await this.channel.consume(
        config.rabbitmq.queueName,
        async (msg: Message | null) => {
          if (!msg) return;

          try {
            const content = JSON.parse(msg.content.toString());
            await callback(content);
            this.channel?.ack(msg);
          } catch (error) {
            logger.error("Error processing message:", error);
            this.channel?.nack(msg, false, true);
          }
        }
      );

      logger.info("Started consuming messages");
    } catch (error) {
      logger.error("Failed to start consuming messages:", error);
      throw error;
    }
  }

  async publish(message: any): Promise<void> {
    if (!this.channel) {
      throw new Error("Channel not initialized");
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      await this.channel.sendToQueue(config.rabbitmq.queueName, messageBuffer, {
        persistent: true,
      });

      logger.info("Message published successfully");
    } catch (error) {
      logger.error("Failed to publish message:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await (this.connection as any).close();
        this.connection = null;
      }
      logger.info("RabbitMQ connection closed");
    } catch (error) {
      logger.error("Error closing RabbitMQ connection:", error);
      throw error;
    }
  }
}
