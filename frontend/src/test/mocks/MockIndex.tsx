import React from "react";
import type { Expense } from "../../types/expense";
import type { Vehicle } from "../../types/vehicle";

interface MockIndexProps {
  expenses: Expense[];
  vehicles: Vehicle[];
  total: number;
  totalPages: number;
  initialSearch?: string;
  initialCategory?: string;
  initialVehicleId?: string;
}

export const MockIndex: React.FC<MockIndexProps> = ({
  expenses,
  vehicles,
  total,
  totalPages,
  initialSearch = "",
  initialCategory,
  initialVehicleId,
}) => {
  return (
    <div>
      <h1>Expense Tracker</h1>
      <div>
        {expenses.map((expense) => (
          <div key={expense.id}>
            <span>{expense.note}</span>
            <span>{expense.amount}</span>
            <span>{expense.category}</span>
            <span>
              {vehicles.find((v) => v.id === expense.vehicleId)?.licensePlate}
            </span>
          </div>
        ))}
      </div>
      <div>
        Total: {total} | Pages: {totalPages}
      </div>
    </div>
  );
};
