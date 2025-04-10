import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseFiltersDto,
} from '../dto/expense.dto';
import { VehicleService } from './vehicle.service';
import { RabbitMQService } from '../processor/rabbitmq.service';
import { ExpenseProcessor } from '../processor/expense.processor';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    private vehicleService: VehicleService,
    private rabbitMQService: RabbitMQService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    // Verify vehicle exists
    await this.vehicleService.findOne(createExpenseDto.vehicleId);

    // Create expense
    const expense = this.expenseRepository.create(createExpenseDto);
    const savedExpense = await this.expenseRepository.save(expense);

    // Send to RabbitMQ for processing
    await this.rabbitMQService.sendExpense(savedExpense);

    return savedExpense;
  }

  async findAll(filters: ExpenseFiltersDto = {}) {
    const { search, category, vehicleId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const queryBuilder = this.expenseRepository.createQueryBuilder('expense');

    if (search) {
      queryBuilder.where('expense.note ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (category) {
      queryBuilder.andWhere('expense.category = :category', { category });
    }

    if (vehicleId) {
      queryBuilder.andWhere('expense.vehicleId = :vehicleId', { vehicleId });
    }

    // Add default sorting by date descending
    queryBuilder.orderBy('expense.date', 'DESC');

    const [expenses, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      expenses,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['vehicle'],
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findOne(id);

    if (updateExpenseDto.vehicleId) {
      // Verify new vehicle exists if vehicleId is being updated
      await this.vehicleService.findOne(updateExpenseDto.vehicleId);
    }

    Object.assign(expense, updateExpenseDto);
    const updatedExpense = await this.expenseRepository.save(expense);

    // Send to RabbitMQ for processing
    await this.rabbitMQService.sendExpense(updatedExpense);

    return updatedExpense;
  }

  async remove(id: number): Promise<void> {
    const expense = await this.findOne(id);
    await this.expenseRepository.remove(expense);
  }

  async getSummary(): Promise<{
    totalExpenses: number;
    byCategory: [string, number][];
  }> {
    const { expenses } = await this.findAll({ limit: 1000 }); // Get up to 1000 expenses for summary
    return ExpenseProcessor.calculateSummary(JSON.stringify(expenses));
  }

  async getMonthlySummary(
    month: string,
  ): Promise<{ totalExpenses: number; byCategory: [string, number][] }> {
    const { expenses } = await this.findAll({ limit: 1000 }); // Get up to 1000 expenses for summary
    return ExpenseProcessor.calculateMonthlySummary(
      JSON.stringify(expenses),
      month,
    );
  }

  async getVehicleSummary(
    vehicleId: number,
  ): Promise<{ totalExpenses: number; byCategory: [string, number][] }> {
    const { expenses } = await this.findAll({
      vehicleId,
      limit: 1000, // Get up to 1000 expenses for summary
    });
    return ExpenseProcessor.calculateVehicleSummary(
      JSON.stringify(expenses),
      vehicleId,
    );
  }
}
