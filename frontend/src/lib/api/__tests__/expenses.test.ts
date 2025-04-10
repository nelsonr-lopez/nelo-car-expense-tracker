import { describe, it, expect, vi, beforeEach } from "vitest";
import { expensesApi } from "../expenses";
import type { Expense, ExpenseListResponse } from "../../../types/expense";
import { ApiError } from "../../error-handling";
import {
  mockExpenseResponse,
  mockExpenseListResponse,
  createMockResponse,
  createMockErrorResponse,
} from "../../../test/utils";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("expensesApi", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("getExpenses", () => {
    it("should fetch expenses successfully", async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse(mockExpenseListResponse)
      );

      const result = await expensesApi.getExpenses({
        page: 1,
        limit: 10,
      });

      expect(result).toEqual(mockExpenseListResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/expenses?page=1&limit=10"),
        expect.any(Object)
      );
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce(
        createMockErrorResponse(500, "Internal server error", "INTERNAL_ERROR")
      );

      try {
        await expensesApi.getExpenses({
          page: 1,
          limit: 10,
        });
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(500);
        expect((error as ApiError).message).toBe("Internal server error");
        expect((error as ApiError).code).toBe("INTERNAL_ERROR");
      }
    });
  });

  describe("createExpense", () => {
    it("should create an expense successfully", async () => {
      const newExpense: Omit<Expense, "id" | "createdAt" | "updatedAt"> = {
        date: "2024-04-10",
        category: "FUEL",
        amount: 50.0,
        note: "Test expense",
        vehicleId: 1,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockExpenseResponse));

      const result = await expensesApi.createExpense(newExpense);

      expect(result).toEqual(mockExpenseResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/expenses"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(newExpense),
        })
      );
    });

    it("should handle validation errors", async () => {
      const invalidExpense = {
        date: "2024-04-10",
        category: "INVALID_CATEGORY",
        amount: -50.0,
        note: "Test expense",
        vehicleId: 1,
      };

      mockFetch.mockResolvedValueOnce(
        createMockErrorResponse(400, "Validation failed", "VALIDATION_ERROR", {
          category: ["Invalid category"],
          amount: ["Amount must be positive"],
        })
      );

      try {
        await expensesApi.createExpense(invalidExpense as any);
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(400);
        expect((error as ApiError).message).toBe("Validation failed");
        expect((error as ApiError).code).toBe("VALIDATION_ERROR");
        expect((error as ApiError).details).toEqual({
          category: ["Invalid category"],
          amount: ["Amount must be positive"],
        });
      }
    });
  });

  describe("updateExpense", () => {
    it("should update an expense successfully", async () => {
      const updateData = {
        amount: 75.0,
        note: "Updated test expense",
      };

      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ...mockExpenseResponse,
          ...updateData,
        })
      );

      const result = await expensesApi.updateExpense(1, updateData);

      expect(result).toEqual({
        ...mockExpenseResponse,
        ...updateData,
      });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/expenses/1"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(updateData),
        })
      );
    });

    it("should handle API errors during update", async () => {
      mockFetch.mockResolvedValueOnce(
        createMockErrorResponse(404, "Expense not found", "NOT_FOUND")
      );

      try {
        await expensesApi.updateExpense(999, { amount: 75.0 });
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(404);
        expect((error as ApiError).message).toBe("Expense not found");
        expect((error as ApiError).code).toBe("NOT_FOUND");
      }
    });
  });

  describe("deleteExpense", () => {
    it("should delete an expense successfully", async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(undefined, 204));

      await expensesApi.deleteExpense(1);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/expenses/1"),
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });

    it("should handle API errors during deletion", async () => {
      mockFetch.mockResolvedValueOnce(
        createMockErrorResponse(404, "Expense not found", "NOT_FOUND")
      );

      try {
        await expensesApi.deleteExpense(999);
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(404);
        expect((error as ApiError).message).toBe("Expense not found");
        expect((error as ApiError).code).toBe("NOT_FOUND");
      }
    });
  });
});
