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

/**
 * Verify an IANA timezone identifier is understood by the runtime.
 */
export function isValidTimezone(timeZone: string | null | undefined): boolean {
  if (!timeZone) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Hour of day (0-23) at `date` as observed in `timeZone`.
 * Used by the reminder scheduler to decide whether a user's local 7am has arrived.
 */
export function getLocalHour(date: Date, timeZone: string): number {
  try {
    return Number(formatInTimeZone(date, timeZone, "H"));
  } catch {
    return Number(formatInTimeZone(date, "UTC", "H"));
  }
}

/**
 * Calendar date at `date` as observed in `timeZone`, formatted "yyyy-MM-dd".
 * Doubles as the once-per-local-day idempotency key for digest sends.
 */
export function getLocalDateKey(date: Date, timeZone: string): string {
  try {
    return formatInTimeZone(date, timeZone, "yyyy-MM-dd");
  } catch {
    return formatInTimeZone(date, "UTC", "yyyy-MM-dd");
  }
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Whole calendar days between `now` and `deadline` as counted in `timeZone`.
 *
 * Deliberately calendar-based rather than elapsed-milliseconds based: a deadline
 * later today returns 0 and one tomorrow returns 1, regardless of the clock time
 * the scan happens to run at. Returns a negative number for past deadlines.
 */
export function calendarDaysUntil(
  deadline: Date,
  now: Date,
  timeZone: string
): number {
  const from = Date.parse(`${getLocalDateKey(now, timeZone)}T00:00:00Z`);
  const to = Date.parse(`${getLocalDateKey(deadline, timeZone)}T00:00:00Z`);
  return Math.round((to - from) / MS_PER_DAY);
}
