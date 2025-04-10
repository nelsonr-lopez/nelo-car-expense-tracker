import { render } from "@testing-library/react";
import { vi } from "vitest";
import { vehiclesApi } from "../lib/api/vehicles";
import { expensesApi } from "../lib/api/expenses";

// Mock API clients
export const mockVehiclesApi = {
  getVehicles: vi.fn(),
  getVehicle: vi.fn(),
  createVehicle: vi.fn(),
  updateVehicle: vi.fn(),
  deleteVehicle: vi.fn(),
};

export const mockExpensesApi = {
  getExpenses: vi.fn(),
  getExpense: vi.fn(),
  createExpense: vi.fn(),
  updateExpense: vi.fn(),
  deleteExpense: vi.fn(),
};

// Mock the API modules
vi.mock("../lib/api/vehicles", () => ({
  vehiclesApi: mockVehiclesApi,
}));

vi.mock("../lib/api/expenses", () => ({
  expensesApi: mockExpensesApi,
}));

// Custom render function that includes providers
export async function renderWithProviders(ui: React.ReactElement) {
  return render(ui);
}

// Helper to reset all mocks
export function resetMocks() {
  vi.clearAllMocks();
  Object.values(mockVehiclesApi).forEach((mock) => mock.mockReset());
  Object.values(mockExpensesApi).forEach((mock) => mock.mockReset());
}
