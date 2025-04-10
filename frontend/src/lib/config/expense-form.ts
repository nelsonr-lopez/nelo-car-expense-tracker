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
    min?: number;
    max?: number;
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
          helperText: "Select the date of the expense",
        },
        {
          id: "vehicle",
          name: "vehicleId",
          label: "Vehicle",
          type: "select",
          required: true,
          options: vehicles.map((vehicle) => ({
            value: vehicle.id,
            label: `${vehicle.name} (${vehicle.make} ${vehicle.model} ${vehicle.year})`,
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
            { value: "fuel", label: "Fuel" },
            { value: "maintenance", label: "Maintenance" },
            { value: "insurance", label: "Insurance" },
            { value: "other", label: "Other" },
          ],
          helperText: "Select the expense category",
        },
        {
          id: "amount",
          name: "amount",
          label: "Amount",
          type: "number",
          required: true,
          helperText: "Enter the expense amount in dollars",
          validation: {
            min: 0.01,
            custom: (value) => {
              if (isNaN(value) || value <= 0) {
                return "Amount must be a positive number";
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
        },
      ],
    },
  ];
}
