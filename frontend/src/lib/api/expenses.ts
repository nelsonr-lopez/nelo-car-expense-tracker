export interface Expense {
  id: number;
  date: string;
  vehicleId: number;
  category: string;
  amount: number;
  note: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ExpenseFilters {
  search?: string;
  category?: string;
  vehicleId?: number;
  page?: number;
  limit?: number;
}

const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

export async function getExpenses(filters: ExpenseFilters = {}): Promise<{
  expenses: Expense[];
  total: number;
  totalPages: number;
}> {
  const searchParams = new URLSearchParams();

  if (filters.search) searchParams.set("search", filters.search);
  if (filters.category) searchParams.set("category", filters.category);
  if (filters.vehicleId)
    searchParams.set("vehicleId", filters.vehicleId.toString());
  if (filters.page) searchParams.set("page", filters.page.toString());
  if (filters.limit) searchParams.set("limit", filters.limit.toString());

  const response = await fetch(
    `${API_URL}/expenses?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }

  return response.json();
}

export async function getExpense(id: number): Promise<Expense> {
  const response = await fetch(`${API_URL}/expenses/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch expense");
  }

  return response.json();
}

export async function updateExpense(
  id: number,
  data: Partial<Expense>
): Promise<Expense> {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update expense");
  }

  return response.json();
}

export async function createExpense(
  data: Omit<Expense, "id" | "createdAt" | "updatedAt">
): Promise<Expense> {
  const response = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create expense");
  }

  return response.json();
}

export async function deleteExpense(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete expense");
  }
}
