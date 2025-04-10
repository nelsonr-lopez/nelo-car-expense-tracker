import type { Vehicle } from "../api/vehicles";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  helperText: string;
  validation?: {
    min?: number | string;
    max?: number | string;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
}

export interface FormSection {
  title: string;
  description: string;
  fields: FormField[];
}

export function getExpenseFormConfig(vehicles: Vehicle[]): FormSection[] {
  const today = new Date().toISOString().split("T")[0];
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const oneYearAgoStr = oneYearAgo.toISOString().split("T")[0];

  return [
    {
      title: "Basic Information",
      description: "Enter the basic details of the expense",
      fields: [
        {
          id: "date",
          name: "date",
          label: "Date",
          type: "date",
          required: true,
          helperText: "Select the date when the expense occurred",
          validation: {
            min: oneYearAgoStr,
            max: today,
            custom: (value) => {
              if (!value) return "Date is required";
              const date = new Date(value);
              if (date > new Date()) {
                return "Date cannot be in the future";
              }
              if (date < oneYearAgo) {
                return "Date cannot be more than a year ago";
              }
              return null;
            },
          },
        },
        {
          id: "vehicle",
          name: "vehicleId",
          label: "Vehicle",
          type: "select",
          required: true,
          options: vehicles.map((vehicle) => ({
            value: vehicle.id.toString(),
            label: `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`,
          })),
          helperText: "Choose the vehicle this expense is for",
        },
      ],
    },
    {
      title: "Expense Details",
      description: "Enter the details of the expense",
      fields: [
        {
          id: "category",
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          options: [
            { value: "FUEL", label: "⛽️ Fuel" },
            { value: "MAINTENANCE", label: "🔧 Maintenance" },
            { value: "REPAIR", label: "🛠 Repair" },
            { value: "INSURANCE", label: "🛡 Insurance" },
            { value: "TAX", label: "💰 Tax" },
            { value: "OTHER", label: "📝 Other" },
          ],
          helperText: "Select the type of expense",
        },
        {
          id: "amount",
          name: "amount",
          label: "Amount",
          type: "number",
          required: true,
          placeholder: "0.00",
          helperText: "Enter the expense amount in dollars",
          validation: {
            min: 0.01,
            custom: (value) => {
              if (!value) return "Amount is required";
              const amount = parseFloat(value);
              if (isNaN(amount) || amount <= 0) {
                return "Amount must be a positive number";
              }
              if (amount > 1000000) {
                return "Amount seems too high. Please verify.";
              }
              if (amount < 0.01) {
                return "Amount must be at least $0.01";
              }
              if (!/^\d+(\.\d{0,2})?$/.test(value)) {
                return "Amount can only have up to 2 decimal places";
              }
              return null;
            },
          },
        },
      ],
    },
    {
      title: "Additional Information",
      description: "Add any additional details about the expense",
      fields: [
        {
          id: "note",
          name: "note",
          label: "Note",
          type: "textarea",
          placeholder: "Add any additional details about this expense...",
          required: false,
          helperText: "Optional: Add any relevant notes about this expense",
          validation: {
            custom: (value) => {
              if (value && value.length > 500) {
                return "Note cannot be longer than 500 characters";
              }
              return null;
            },
          },
        },
      ],
    },
  ];
}
