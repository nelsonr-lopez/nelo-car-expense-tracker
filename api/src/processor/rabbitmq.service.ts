import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Channel, connect } from "amqplib";
import { Expense } from "../entities/expense.entity";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: any = null;
  private channel: Channel | null = null;
  private readonly queueName: string;

  constructor(private configService: ConfigService) {
    this.queueName =
      this.configService.get<string>("RABBITMQ_QUEUE") || "expense_queue";
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async connect() {
    try {
      this.connection = await connect(
        this.configService.get<string>("RABBITMQ_URL") || "amqp://localhost"
      );
      this.channel = await this.connection.createChannel();

      // Ensure the expense queue exists
      await this.channel.assertQueue(this.queueName, {
        durable: true,
        deadLetterExchange: `${this.queueName}_dlx`,
        deadLetterRoutingKey: `${this.queueName}_dlq`,
      });

      // Set up dead letter exchange and queue
      await this.channel.assertExchange(`${this.queueName}_dlx`, "direct", {
        durable: true,
      });
      await this.channel.assertQueue(`${this.queueName}_dlq`, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": this.queueName,
          "x-dead-letter-routing-key": this.queueName,
        },
      });
      await this.channel.bindQueue(
        `${this.queueName}_dlq`,
        `${this.queueName}_dlx`,
        `${this.queueName}_dlq`
      );
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error);
      throw error;
    }
  }

  private async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
    }
  }

  async sendExpense(expense: Expense): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error("RabbitMQ channel not initialized");
      }

      await this.channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(expense)),
        {
          persistent: true,
          contentType: "application/json",
          contentEncoding: "utf-8",
        }
      );
    } catch (error) {
      console.error("Failed to send expense to RabbitMQ:", error);
      throw error;
    }
  }
}
