import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges CSS class names dynamically with Tailwind CSS conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date object or ISO string into a localized human-readable string.
 */
export function formatDate(date: Date | string | null | undefined, locale = "en-US"): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid Date";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

/**
 * Calculates remaining days from today until target deadline.
 */
export function getDaysRemaining(deadline: Date | string | null | undefined): {
  days: number;
  label: string;
  isOverdue: boolean;
} {
  if (!deadline) {
    return { days: 0, label: "No Deadline", isOverdue: false };
  }
  const target = typeof deadline === "string" ? new Date(deadline) : deadline;
  const now = new Date();
  
  // Set both dates to start of day for accurate comparison
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const elapsed = Math.abs(diffDays);
    return {
      days: elapsed,
      label: elapsed === 1 ? "Deadline passed (1d ago)" : `Deadline passed (${elapsed}d ago)`,
      isOverdue: true,
    };
  }
  if (diffDays === 0) {
    return { days: 0, label: "Due Today", isOverdue: false };
  }
  return { days: diffDays, label: `${diffDays}d left`, isOverdue: false };
}
