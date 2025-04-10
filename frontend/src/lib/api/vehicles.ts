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

const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

export async function getVehicles(): Promise<Vehicle[]> {
  const response = await fetch(`${API_URL}/vehicles`);

  if (!response.ok) {
    throw new Error("Failed to fetch vehicles");
  }

  return response.json();
}

export async function getVehicle(id: number): Promise<Vehicle> {
  const response = await fetch(`${API_URL}/vehicles/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch vehicle");
  }

  return response.json();
}

export async function createVehicle(
  data: Omit<Vehicle, "id" | "createdAt" | "updatedAt">
): Promise<Vehicle> {
  const response = await fetch(`${API_URL}/vehicles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create vehicle");
  }

  return response.json();
}

export async function updateVehicle(
  id: number,
  data: Partial<Omit<Vehicle, "id" | "createdAt" | "updatedAt">>
): Promise<Vehicle> {
  const response = await fetch(`${API_URL}/vehicles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update vehicle");
  }

  return response.json();
}

export async function deleteVehicle(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/vehicles/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete vehicle");
  }
}
