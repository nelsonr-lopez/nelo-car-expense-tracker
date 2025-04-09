import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expense } from "../../entities/expense.entity";
import { CreateExpenseDto } from "../../dto/create-expense.dto";

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>
  ) {}

  async findAll(): Promise<Expense[]> {
    return this.expensesRepository.find({
      relations: ["vehicle"],
      order: { date: "DESC" },
    });
  }

  async findOne(id: number): Promise<Expense> {
    return this.expensesRepository.findOne({
      where: { id },
      relations: ["vehicle"],
    });
  }

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expensesRepository.create(createExpenseDto);
    return this.expensesRepository.save(expense);
  }

  async remove(id: number): Promise<void> {
    await this.expensesRepository.delete(id);
  }

  async getSummary(
    month?: string
  ): Promise<{
    total: number;
    byCategory: { category: string; amount: number }[];
  }> {
    const query = this.expensesRepository.createQueryBuilder("expense");

    if (month) {
      const [year, monthNum] = month.split("-").map(Number);
      query
        .where("EXTRACT(YEAR FROM expense.date) = :year", { year })
        .andWhere("EXTRACT(MONTH FROM expense.date) = :month", {
          month: monthNum,
        });
    }

    const expenses = await query.getMany();

    const total = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    const byCategory = expenses.reduce((acc, expense) => {
      const category = expense.category;
      const amount = Number(expense.amount);

      const existingCategory = acc.find((item) => item.category === category);
      if (existingCategory) {
        existingCategory.amount += amount;
      } else {
        acc.push({ category, amount });
      }

      return acc;
    }, [] as { category: string; amount: number }[]);

    return { total, byCategory };
  }
}
