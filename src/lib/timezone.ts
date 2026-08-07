import { formatInTimeZone, toZonedTime } from "date-fns-tz";

/**
 * Format a Date or ISO string in a specific IANA timezone (e.g. "Africa/Lagos", "America/New_York").
 */
export function formatInUserTimezone(
  date: Date | string | null | undefined,
  timeZone: string = "Africa/Lagos",
  formatStr: string = "PPP p"
): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "N/A";

  try {
    return formatInTimeZone(d, timeZone, formatStr);
  } catch (err) {
    console.warn(`Invalid timezone "${timeZone}", falling back to UTC:`, err);
    return formatInTimeZone(d, "UTC", formatStr);
  }
}

/**
 * Convert a Date object to local zoned time in target timezone.
 */
export function getZonedDate(date: Date, timeZone: string = "Africa/Lagos"): Date {
  try {
    return toZonedTime(date, timeZone);
  } catch {
    return date;
  }
}
