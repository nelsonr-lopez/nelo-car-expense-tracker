import { Injectable } from "@nestjs/common";
import { Expense } from "../entities/expense.entity";

@Injectable()
export class MockRabbitMQService {
  async sendExpense(expense: Expense): Promise<void> {
    // Mock implementation
    return Promise.resolve();
  }
}
