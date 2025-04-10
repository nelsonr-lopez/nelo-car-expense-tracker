import { describe, it, expect, beforeEach } from "vitest";
import {
  mockExpensesApi,
  mockVehiclesApi,
  mockExpenseListResponse,
  mockVehicleListResponse,
  resetMocks,
  renderAstroComponent,
} from "../test/utils";
import type { APIRoute } from "astro";
import Index from "./index.astro";

describe("Index Page", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("renders the expense tracker page", async () => {
    mockExpensesApi.getExpenses.mockResolvedValue(mockExpenseListResponse);
    mockVehiclesApi.getVehicles.mockResolvedValue(mockVehicleListResponse);

    const rendered = await renderAstroComponent(Index);
    const html = rendered.toString();

    // Verify that the page contains key elements
    expect(html).toContain("Expense Tracker");
    expect(html).toContain("Test expense"); // From mockExpenseResponse
    expect(html).toContain("ABC123"); // From mockVehicleResponse

    // Verify API calls
    expect(mockExpensesApi.getExpenses).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      search: "",
      category: undefined,
      vehicleId: undefined,
    });

    expect(mockVehiclesApi.getVehicles).toHaveBeenCalledWith({
      page: 1,
      limit: 100,
    });
  });

  it("handles API errors gracefully", async () => {
    const error = new Error("Failed to fetch expenses");
    mockExpensesApi.getExpenses.mockRejectedValue(error);
    mockVehiclesApi.getVehicles.mockResolvedValue(mockVehicleListResponse);

    const rendered = await renderAstroComponent(Index);
    const html = rendered.toString();

    // Verify that the error message is displayed
    expect(html).toContain("Failed to fetch expenses");
  });
});
