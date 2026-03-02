import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LineItem } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyExact(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-AU").format(n);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function getCategoryTotal(items: LineItem[], category: string): number {
  return items
    .filter((item) => item.category === category)
    .reduce((sum, item) => sum + item.totalCost, 0);
}

export function getProjectTotals(items: LineItem[], estimatedBudget: number) {
  const totalCommitted = items.reduce((sum, item) => sum + item.totalCost, 0);
  const contractedAndInvoiced = items
    .filter((i) => i.status === "contracted" || i.status === "invoiced")
    .reduce((sum, i) => sum + i.totalCost, 0);
  const variance = estimatedBudget - totalCommitted;
  const percentComplete =
    estimatedBudget > 0
      ? Math.round((contractedAndInvoiced / estimatedBudget) * 100)
      : 0;

  return {
    totalCommitted,
    contractedAndInvoiced,
    variance,
    percentComplete: Math.min(percentComplete, 100),
  };
}

export function getStatusColor(status: string) {
  switch (status) {
    case "estimated":
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    case "quoted":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "contracted":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "invoiced":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  }
}

export function getProjectStatusColor(status: string) {
  switch (status) {
    case "estimating":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "pre-construction":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "in-progress":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "complete":
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  }
}

export function getProjectTypeLabel(type: string) {
  switch (type) {
    case "industrial":
      return "Industrial";
    case "residential":
      return "Residential";
    case "commercial":
      return "Commercial";
    case "mixed-use":
      return "Mixed Use";
    default:
      return type;
  }
}
