import { BaseApiClient } from "../api-client/base";
import type {
  Expense,
  ExpenseFilters,
  ExpenseListResponse,
} from "../../types/expense";

export class ExpensesApiClient extends BaseApiClient {
  async getExpenses(
    filters: ExpenseFilters = {}
  ): Promise<ExpenseListResponse> {
    const searchParams = new URLSearchParams();

    if (filters.search) searchParams.set("search", filters.search);
    if (filters.category) searchParams.set("category", filters.category);
    if (filters.vehicleId)
      searchParams.set("vehicleId", filters.vehicleId.toString());
    if (filters.page) searchParams.set("page", filters.page.toString());
    if (filters.limit) searchParams.set("limit", filters.limit.toString());

    return this.get<ExpenseListResponse>(
      `/expenses?${searchParams.toString()}`
    );
  }

  async getExpense(id: number): Promise<Expense> {
    return this.get<Expense>(`/expenses/${id}`);
  }

  async createExpense(expense: Omit<Expense, "id">): Promise<Expense> {
    return this.post<Expense>("/expenses", expense);
  }

  async updateExpense(id: number, expense: Partial<Expense>): Promise<Expense> {
    return this.put<Expense>(`/expenses/${id}`, expense);
  }

  async deleteExpense(id: number): Promise<void> {
    return this.delete<void>(`/expenses/${id}`);
  }
}

// Create a singleton instance
const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";
export const expensesApi = new ExpensesApiClient(API_URL);

export type {
  Expense,
  ExpenseFilters,
  ExpenseListResponse,
} from "../../types/expense";
