export type ExpenseCategory =
  | "FUEL"
  | "MAINTENANCE"
  | "REPAIR"
  | "INSURANCE"
  | "TAX"
  | "OTHER";

export interface Expense {
  id: number;
  date: string;
  vehicleId: number;
  category: ExpenseCategory;
  amount: number;
  note: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseFilters {
  search?: string;
  category?: ExpenseCategory;
  vehicleId?: number;
  page?: number;
  limit?: number;
}

export interface ExpenseListResponse {
  expenses: Expense[];
  total: number;
  totalPages: number;
}
