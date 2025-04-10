import { Injectable } from '@nestjs/common';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class ExpenseProcessor {
  static calculateSummary(expensesJson: string): {
    totalExpenses: number;
    byCategory: [string, number][];
  } {
    const expenses: Expense[] = JSON.parse(expensesJson);
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const categoryMap = new Map<string, number>();
    expenses.forEach((expense) => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    const byCategory = Array.from(categoryMap.entries());
    byCategory.sort((a, b) => b[1] - a[1]); // Sort by amount in descending order

    return {
      totalExpenses,
      byCategory,
    };
  }

  static calculateMonthlySummary(
    expensesJson: string,
    month: string,
  ): {
    totalExpenses: number;
    byCategory: [string, number][];
  } {
    const expenses: Expense[] = JSON.parse(expensesJson);
    const [year, monthNum] = month.split('-').map(Number);

    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getFullYear() === year &&
        expenseDate.getMonth() + 1 === monthNum
      );
    });

    return this.calculateSummary(JSON.stringify(monthlyExpenses));
  }

  static calculateVehicleSummary(
    expensesJson: string,
    vehicleId: number,
  ): {
    totalExpenses: number;
    byCategory: [string, number][];
  } {
    const expenses: Expense[] = JSON.parse(expensesJson);
    const vehicleExpenses = expenses.filter(
      (expense) => expense.vehicleId === vehicleId,
    );

    return this.calculateSummary(JSON.stringify(vehicleExpenses));
  }
}
