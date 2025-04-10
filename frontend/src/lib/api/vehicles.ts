import { BaseApiClient } from "../api-client/base";
import type {
  Vehicle,
  VehicleFilters,
  VehicleListResponse,
} from "../../types/vehicle";

export class VehiclesApiClient extends BaseApiClient {
  async getVehicles(
    filters: VehicleFilters = {}
  ): Promise<VehicleListResponse> {
    const searchParams = new URLSearchParams();

    if (filters.search) searchParams.set("search", filters.search);
    if (filters.make) searchParams.set("make", filters.make);
    if (filters.model) searchParams.set("model", filters.model);
    if (filters.year) searchParams.set("year", filters.year.toString());
    if (filters.page) searchParams.set("page", filters.page.toString());
    if (filters.limit) searchParams.set("limit", filters.limit.toString());

    return this.get<VehicleListResponse>(
      `/vehicles?${searchParams.toString()}`
    );
  }

  async getVehicle(id: number): Promise<Vehicle> {
    return this.get<Vehicle>(`/vehicles/${id}`);
  }

  async createVehicle(
    data: Omit<Vehicle, "id" | "createdAt" | "updatedAt">
  ): Promise<Vehicle> {
    return this.post<Vehicle>("/vehicles", data);
  }

  async updateVehicle(
    id: number,
    data: Partial<Omit<Vehicle, "id" | "createdAt" | "updatedAt">>
  ): Promise<Vehicle> {
    return this.put<Vehicle>(`/vehicles/${id}`, data);
  }

  async deleteVehicle(id: number): Promise<void> {
    return this.delete<void>(`/vehicles/${id}`);
  }
}

// Create a singleton instance
const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";
export const vehiclesApi = new VehiclesApiClient(API_URL);

export type {
  Vehicle,
  VehicleFilters,
  VehicleListResponse,
} from "../../types/vehicle";
