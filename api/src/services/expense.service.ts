import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expense } from "../entities/expense.entity";
import { CreateExpenseDto, UpdateExpenseDto } from "../dto/expense.dto";
import { ExpenseProcessor } from "../processor";

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>
  ) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    // Validate using Haskell processor
    const validationResult = ExpenseProcessor.validateExpense(
      JSON.stringify(createExpenseDto)
    );
    if (!validationResult.valid) {
      throw new Error(
        `Validation failed: ${validationResult.errors?.join(", ")}`
      );
    }

    const expense = this.expenseRepository.create(createExpenseDto);
    return this.expenseRepository.save(expense);
  }

  async findAll(): Promise<Expense[]> {
    return this.expenseRepository.find();
  }

  async findOne(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto
  ): Promise<Expense> {
    // Validate using Haskell processor
    const validationResult = ExpenseProcessor.validateExpense(
      JSON.stringify(updateExpenseDto)
    );
    if (!validationResult.valid) {
      throw new Error(
        `Validation failed: ${validationResult.errors?.join(", ")}`
      );
    }

    const expense = await this.findOne(id);
    Object.assign(expense, updateExpenseDto);
    return this.expenseRepository.save(expense);
  }

  async remove(id: number): Promise<void> {
    const expense = await this.findOne(id);
    await this.expenseRepository.remove(expense);
  }

  async getSummary(): Promise<{
    totalExpenses: number;
    byCategory: [string, number][];
  }> {
    const expenses = await this.findAll();
    return ExpenseProcessor.calculateSummary(JSON.stringify(expenses));
  }

  async getMonthlySummary(
    month: string
  ): Promise<{ totalExpenses: number; byCategory: [string, number][] }> {
    const expenses = await this.findAll();
    return ExpenseProcessor.calculateMonthlySummary(
      JSON.stringify(expenses),
      month
    );
  }

  async getVehicleSummary(
    vehicleId: number
  ): Promise<{ totalExpenses: number; byCategory: [string, number][] }> {
    const expenses = await this.findAll();
    return ExpenseProcessor.calculateVehicleSummary(
      JSON.stringify(expenses),
      vehicleId
    );
  }
}
