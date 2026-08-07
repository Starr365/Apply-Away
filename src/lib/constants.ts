import type { OpportunityStatus } from "@/domain/opportunity.types";

/* -------------------------------------------------------------------------- */
/*  Status Labels & Colors                                                    */
/* -------------------------------------------------------------------------- */

export const STATUS_LABELS: Record<OpportunityStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted",
  INTERVIEW: "Interview",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export const STATUS_COLOR_MAP: Record<OpportunityStatus, string> = {
  NOT_STARTED: "text-slate-400",
  IN_PROGRESS: "text-sky-400",
  SUBMITTED: "text-purple-400",
  INTERVIEW: "text-amber-400",
  ACCEPTED: "text-emerald-400",
  REJECTED: "text-rose-400",
};

/* -------------------------------------------------------------------------- */
/*  Common Timezones                                                          */
/* -------------------------------------------------------------------------- */

export const COMMON_TIMEZONES = [
  { value: "Africa/Lagos", label: "West Africa Time (WAT) – Africa/Lagos" },
  { value: "Africa/Cairo", label: "Eastern European Time (EET) – Africa/Cairo" },
  { value: "Africa/Johannesburg", label: "South Africa Standard Time (SAST) – Africa/Johannesburg" },
  { value: "Africa/Nairobi", label: "East Africa Time (EAT) – Africa/Nairobi" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT) – Europe/London" },
  { value: "Europe/Paris", label: "Central European Time (CET) – Europe/Paris" },
  { value: "America/New_York", label: "Eastern Time (EST/EDT) – America/New_York" },
  { value: "America/Chicago", label: "Central Time (CST/CDT) – America/Chicago" },
  { value: "America/Los_Angeles", label: "Pacific Time (PST/PDT) – America/Los_Angeles" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST) – Asia/Dubai" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT) – Asia/Singapore" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST) – Asia/Tokyo" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Pagination Defaults                                                       */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PAGE_SIZE = 10;

/* -------------------------------------------------------------------------- */
/*  Reminder Windows                                                          */
/* -------------------------------------------------------------------------- */

export const REMINDER_WINDOWS = [
  { key: "14_DAYS", label: "14 Days Before", days: 14 },
  { key: "7_DAYS", label: "7 Days Before", days: 7 },
  { key: "3_DAYS", label: "3 Days Before", days: 3 },
  { key: "1_DAY", label: "1 Day Before", days: 1 },
  { key: "DUE_TODAY", label: "Due Today", days: 0 },
] as const;
