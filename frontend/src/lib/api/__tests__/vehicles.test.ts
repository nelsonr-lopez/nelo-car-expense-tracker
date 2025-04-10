import { describe, it, expect, vi, beforeEach } from "vitest";
import { vehiclesApi } from "../vehicles";
import type { Vehicle, VehicleListResponse } from "../../../types/vehicle";
import { ApiError } from "../../error-handling";
import {
  mockVehicleResponse,
  mockVehicleListResponse,
  createMockResponse,
  createMockErrorResponse,
} from "../../../test/utils";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("vehiclesApi", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("getVehicles", () => {
    it("should fetch vehicles successfully", async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse(mockVehicleListResponse)
      );

      const result = await vehiclesApi.getVehicles();

      expect(result).toEqual(mockVehicleListResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/vehicles"),
        expect.any(Object)
      );
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce(
        createMockErrorResponse(500, "Internal server error", "INTERNAL_ERROR")
      );

      try {
        await vehiclesApi.getVehicles();
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(500);
        expect((error as ApiError).message).toBe("Internal server error");
        expect((error as ApiError).code).toBe("INTERNAL_ERROR");
      }
    });
  });

  describe("createVehicle", () => {
    it("should create a vehicle successfully", async () => {
      const newVehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt"> = {
        licensePlate: "ABC123",
        make: "Toyota",
        model: "Camry",
        year: 2020,
        vin: "1HGCM82633A123456",
        notes: "Test vehicle",
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockVehicleResponse));

      const result = await vehiclesApi.createVehicle(newVehicle);

      expect(result).toEqual(mockVehicleResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/vehicles"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(newVehicle),
        })
      );
    });

    it("should handle validation errors", async () => {
      const invalidVehicle = {
        licensePlate: "",
        make: "",
        model: "",
        year: 1800,
        vin: "invalid",
        notes: "",
      };

      mockFetch.mockResolvedValueOnce(
        createMockErrorResponse(400, "Validation failed", "VALIDATION_ERROR", {
          licensePlate: ["License plate is required"],
          make: ["Make is required"],
          model: ["Model is required"],
          year: ["Year must be between 1900 and current year"],
          vin: ["Invalid VIN format"],
        })
      );

      try {
        await vehiclesApi.createVehicle(invalidVehicle as any);
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(400);
        expect((error as ApiError).message).toBe("Validation failed");
        expect((error as ApiError).code).toBe("VALIDATION_ERROR");
        expect((error as ApiError).details).toEqual({
          licensePlate: ["License plate is required"],
          make: ["Make is required"],
          model: ["Model is required"],
          year: ["Year must be between 1900 and current year"],
          vin: ["Invalid VIN format"],
        });
      }
    });
  });

  describe("updateVehicle", () => {
    it("should update a vehicle successfully", async () => {
      const updateData = {
        make: "Honda",
        model: "Accord",
      };

      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ...mockVehicleResponse,
          ...updateData,
        })
      );

      const result = await vehiclesApi.updateVehicle(1, updateData);

      expect(result).toEqual({
        ...mockVehicleResponse,
        ...updateData,
      });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/vehicles/1"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(updateData),
        })
      );
    });

    it("should handle API errors during update", async () => {
      mockFetch.mockResolvedValueOnce(
        createMockErrorResponse(404, "Vehicle not found", "NOT_FOUND")
      );

      try {
        await vehiclesApi.updateVehicle(999, { make: "Honda" });
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(404);
        expect((error as ApiError).message).toBe("Vehicle not found");
        expect((error as ApiError).code).toBe("NOT_FOUND");
      }
    });
  });

  describe("deleteVehicle", () => {
    it("should delete a vehicle successfully", async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(undefined, 204));

      await vehiclesApi.deleteVehicle(1);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/vehicles/1"),
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });

    it("should handle API errors during deletion", async () => {
      mockFetch.mockResolvedValueOnce(
        createMockErrorResponse(404, "Vehicle not found", "NOT_FOUND")
      );

      try {
        await vehiclesApi.deleteVehicle(999);
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(404);
        expect((error as ApiError).message).toBe("Vehicle not found");
        expect((error as ApiError).code).toBe("NOT_FOUND");
      }
    });
  });
});
