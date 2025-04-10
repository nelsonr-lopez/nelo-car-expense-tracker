import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ExpenseCategory } from "../types/expense";
import { vi } from "vitest";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 

export function resetMocks() {
  vi.resetAllMocks();
} 