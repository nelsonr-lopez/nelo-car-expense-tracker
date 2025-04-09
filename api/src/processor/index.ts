import * as ffi from "ffi-napi";
import * as ref from "ref-napi";
import * as path from "path";

// Define the library interface
const processorLib = ffi.Library(
  path.join(__dirname, "../../../processor-service/lib/libprocessor"),
  {
    validate_expense_json: ["string", ["string"]],
    calculate_summary_json: ["string", ["string"]],
    calculate_monthly_summary_json: ["string", ["string", "string"]],
    calculate_vehicle_summary_json: ["string", ["string", "int"]],
  }
);

export class ExpenseProcessor {
  static validateExpense(expenseJson: string): {
    valid: boolean;
    errors?: string[];
  } {
    const result = processorLib.validate_expense_json(expenseJson);
    return JSON.parse(result);
  }

  static calculateSummary(expensesJson: string): {
    totalExpenses: number;
    byCategory: [string, number][];
  } {
    const result = processorLib.calculate_summary_json(expensesJson);
    return JSON.parse(result);
  }

  static calculateMonthlySummary(
    expensesJson: string,
    month: string
  ): { totalExpenses: number; byCategory: [string, number][] } {
    const result = processorLib.calculate_monthly_summary_json(
      expensesJson,
      month
    );
    return JSON.parse(result);
  }

  static calculateVehicleSummary(
    expensesJson: string,
    vehicleId: number
  ): { totalExpenses: number; byCategory: [string, number][] } {
    const result = processorLib.calculate_vehicle_summary_json(
      expensesJson,
      vehicleId
    );
    return JSON.parse(result);
  }
}
