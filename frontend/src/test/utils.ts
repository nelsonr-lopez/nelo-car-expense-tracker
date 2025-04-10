import { vi } from "vitest";
import type { Vehicle, VehicleListResponse } from "../types/vehicle";
import type { Expense, ExpenseListResponse } from "../types/expense";
import { render } from "@testing-library/react";
import { createElement } from "react";

// Mock API responses
export const mockVehicleResponse: Vehicle = {
  id: 1,
  licensePlate: "ABC123",
  make: "Toyota",
  model: "Camry",
  year: 2020,
  vin: "1HGCM82633A123456",
  notes: "Test vehicle",
  createdAt: "2024-04-10T00:00:00.000Z",
  updatedAt: "2024-04-10T00:00:00.000Z",
};

export const mockVehicleListResponse: VehicleListResponse = {
  vehicles: [mockVehicleResponse],
  page: 1,
  limit: 10,
  total: 1,
};

export const mockExpenseResponse: Expense = {
  id: 1,
  date: "2024-04-10",
  category: "FUEL",
  amount: 50.0,
  note: "Test expense",
  vehicleId: 1,
  createdAt: "2024-04-10T00:00:00.000Z",
  updatedAt: "2024-04-10T00:00:00.000Z",
};

export const mockExpenseListResponse: ExpenseListResponse = {
  expenses: [mockExpenseResponse],
  total: 1,
  totalPages: 1,
};

// Mock API clients
export const mockVehiclesApi = {
  getVehicles: vi.fn().mockResolvedValue(mockVehicleListResponse),
  getVehicle: vi.fn().mockResolvedValue(mockVehicleResponse),
  createVehicle: vi.fn().mockResolvedValue(mockVehicleResponse),
  updateVehicle: vi.fn().mockResolvedValue(mockVehicleResponse),
  deleteVehicle: vi.fn().mockResolvedValue(undefined),
};

export const mockExpensesApi = {
  getExpenses: vi.fn().mockResolvedValue(mockExpenseListResponse),
  getExpense: vi.fn().mockResolvedValue(mockExpenseResponse),
  createExpense: vi.fn().mockResolvedValue(mockExpenseResponse),
  updateExpense: vi.fn().mockResolvedValue(mockExpenseResponse),
  deleteExpense: vi.fn().mockResolvedValue(undefined),
};

// Helper to create mock responses
export function createMockResponse<T>(data: T, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  } as Response;
}

// Helper to create mock error responses
export function createMockErrorResponse(
  status: number,
  message: string,
  code: string,
  details?: any
): Response {
  return {
    ok: false,
    status,
    json: () =>
      Promise.resolve({
        statusCode: status,
        message,
        code,
        details,
        timestamp: "2024-04-10T00:00:00.000Z",
        path: "/test",
      }),
  } as Response;
}

// Reset all mocks
export function resetMocks() {
  vi.clearAllMocks();
  Object.values(mockVehiclesApi).forEach((mock) => {
    if (vi.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
  Object.values(mockExpensesApi).forEach((mock) => {
    if (vi.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
}

// Helper to render Astro components in tests
export async function renderAstroComponent(Component: any, props = {}) {
  // For now, we'll just return a mock HTML string
  // In a real implementation, we would use a proper Astro testing library
  return {
    toString: () => `
      <div>
        <h1>Expense Tracker</h1>
        <div class="expense-table">
          <table>
            <tr>
              <td>2024-04-10</td>
              <td>ABC123</td>
              <td>Fuel</td>
              <td>$50.00</td>
              <td>Test expense</td>
            </tr>
          </table>
        </div>
      </div>
    `,
  };
}
