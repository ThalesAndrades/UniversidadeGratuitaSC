import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

export function formatDate(dateString: string): string {
  // Parse manually to avoid UTC→local timezone shift (e.g. "2009-03-15" shown as "14/03/2009" in UTC-3)
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export function generateYears(): number[] {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 16; year >= currentYear - 100; year--) {
    years.push(year);
  }
  return years;
}

export function getDaysInMonth(month: number, year: number): number[] {
  const daysCount = new Date(year, month, 0).getDate();
  return Array.from({ length: daysCount }, (_, i) => i + 1);
}
