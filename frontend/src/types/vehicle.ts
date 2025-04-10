export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleFilters {
  search?: string;
  make?: string;
  model?: string;
  year?: number;
  page?: number;
  limit?: number;
}

export interface VehicleListResponse {
  vehicles: Vehicle[];
  page: number;
  limit: number;
  total: number;
}
