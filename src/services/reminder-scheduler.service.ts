import type { OpportunityStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EmailService, type DigestItem } from "./email.service";
import { getAppUrl } from "@/lib/app-url";
import {
  calendarDaysUntil,
  formatInUserTimezone,
  getLocalDateKey,
  getLocalHour,
} from "@/lib/timezone";
import { env } from "@/lib/env";

export interface ReminderCheckSummary {
  scannedCount: number;
  dispatchedCount: number;
  skippedCount: number;
  errors: string[];
}

export type ReminderType =
  | "14_DAYS"
  | "7_DAYS"
  | "3_DAYS"
  | "24_HOURS"
  | "12_HOURS"
  | "DUE_TODAY";

/**
 * Calendar-day milestones covered by the daily 7am digest, keyed by whole days
 * remaining in the user's own timezone.
 */
const DIGEST_MILESTONES: Record<number, ReminderType> = {
  14: "14_DAYS",
  7: "7_DAYS",
  3: "3_DAYS",
  1: "24_HOURS",
  0: "DUE_TODAY",
};

/**
 * The one sub-daily alert. Kept as an immediate per-opportunity email because a
 * 12-hour warning is meaningless if it waits for the next morning's digest.
 */
const URGENT_WINDOW = {
  reminderType: "12_HOURS" as const,
  label: "12 Hours Remaining",
  minMs: 8 * 60 * 60 * 1000,
  maxMs: 14 * 60 * 60 * 1000,
};

/** Statuses that mean the application is done; no further reminders needed. */
const CLOSED_STATUSES: OpportunityStatus[] = ["SUBMITTED", "ACCEPTED", "REJECTED"];
const ACTIVE_STATUS_FILTER = { notIn: CLOSED_STATUSES };

/** Resend's free tier allows 2 requests/second; stay comfortably under it. */
const SEND_THROTTLE_MS = 600;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function emptySummary(): ReminderCheckSummary {
  return { scannedCount: 0, dispatchedCount: 0, skippedCount: 0, errors: [] };
}

export class ReminderSchedulerService {
  private emailService = new EmailService();

  /**
   * Daily digest pass. Sends each user a single email at the first scan that
   * lands at or after REMINDER_HOUR (default 7am) in their own timezone, at most
   * once per local calendar day.
   *
   * The "at or after" plus once-per-day-key gate is what makes this tolerant of
   * an external scheduler that jitters or skips a run: a late scan still
   * delivers, and a duplicate scan does nothing.
   */
  async processDailyDigests(now: Date = new Date()): Promise<ReminderCheckSummary> {
    const summary = emptySummary();

    let users: Awaited<ReturnType<typeof this.fetchDigestCandidates>>;
    try {
      users = await this.fetchDigestCandidates(now);
    } catch (err) {
      summary.errors.push(`Database scan error: ${toMessage(err)}`);
      return summary;
    }

    summary.scannedCount = users.length;

    for (const user of users) {
      if (!user.email) {
        summary.skippedCount++;
        continue;
      }

      const timezone = user.timezone || env.DEFAULT_TIMEZONE;
      const todayKey = getLocalDateKey(now, timezone);

      // Not yet 7am for this user, or already briefed today.
      if (getLocalHour(now, timezone) < env.REMINDER_HOUR || user.lastDigestDate === todayKey) {
        summary.skippedCount++;
        continue;
      }

      const items: DigestItem[] = [];
      const logsToCreate: { userId: string; opportunityId: string; reminderType: string }[] = [];

      for (const opp of user.opportunities) {
        if (!opp.deadline) continue;

        const daysLeft = calendarDaysUntil(opp.deadline, now, timezone);
        const reminderType = DIGEST_MILESTONES[daysLeft];
        if (!reminderType) continue;
        if (user.sentKeys.has(`${opp.id}:${reminderType}`)) continue;

        items.push({
          title: opp.title,
          organization: opp.organization,
          deadlineFormatted: formatInUserTimezone(
            opp.deadline,
            timezone,
            "eeee, MMMM d, yyyy 'at' h:mm a (zzz)"
          ),
          daysLeft,
          url: `${getAppUrl()}/opportunities/${opp.id}`,
        });

        logsToCreate.push({
          userId: user.id,
          opportunityId: opp.id,
          reminderType,
        });
      }

      try {
        if (items.length > 0) {
          await this.emailService.sendDigestEmail({
            toEmail: user.email,
            userName: user.name || "Opportunity Seeker",
            userTimezone: timezone,
            items,
          });

          // Log the sends and close out the day atomically, so a crash between
          // the two can never leave a user eligible for a duplicate digest.
          await prisma.$transaction([
            prisma.reminderLog.createMany({ data: logsToCreate, skipDuplicates: true }),
            prisma.user.update({
              where: { id: user.id },
              data: { lastDigestDate: todayKey },
            }),
          ]);

          summary.dispatchedCount++;
          await sleep(SEND_THROTTLE_MS);
        } else {
          // Nothing to report — still close out the day so we don't re-scan
          // this user on every run until midnight.
          await prisma.user.update({
            where: { id: user.id },
            data: { lastDigestDate: todayKey },
          });
          summary.skippedCount++;
        }
      } catch (err) {
        summary.errors.push(`Digest failed for ${user.email}: ${toMessage(err)}`);
      }
    }

    return summary;
  }

  /**
   * Sub-daily pass for the 12-hour alert. Runs on every invocation, independent
   * of the user's local hour.
   */
  async processUrgentAlerts(now: Date = new Date()): Promise<ReminderCheckSummary> {
    const summary = emptySummary();

    let opportunities;
    try {
      opportunities = await prisma.opportunity.findMany({
        where: {
          deadline: {
            gte: new Date(now.getTime() + URGENT_WINDOW.minMs),
            lte: new Date(now.getTime() + URGENT_WINDOW.maxMs),
          },
          status: ACTIVE_STATUS_FILTER,
        },
        include: {
          user: true,
          reminderLogs: { where: { reminderType: URGENT_WINDOW.reminderType } },
        },
      });
    } catch (err) {
      summary.errors.push(`Database scan error: ${toMessage(err)}`);
      return summary;
    }

    summary.scannedCount = opportunities.length;

    for (const opp of opportunities) {
      if (!opp.deadline || !opp.user?.email) {
        summary.skippedCount++;
        continue;
      }

      if (opp.reminderLogs.length > 0) {
        summary.skippedCount++;
        continue;
      }

      const timezone = opp.user.timezone || env.DEFAULT_TIMEZONE;

      try {
        await this.emailService.sendReminderEmail({
          toEmail: opp.user.email,
          userName: opp.user.name || "Opportunity Seeker",
          opportunityTitle: opp.title,
          organization: opp.organization,
          reminderTypeLabel: URGENT_WINDOW.label,
          deadlineFormatted: formatInUserTimezone(
            opp.deadline,
            timezone,
            "eeee, MMMM d, yyyy 'at' h:mm a (zzz)"
          ),
          userTimezone: timezone,
          opportunityUrl: `${getAppUrl()}/opportunities/${opp.id}`,
        });

        await prisma.reminderLog.create({
          data: {
            userId: opp.userId,
            opportunityId: opp.id,
            reminderType: URGENT_WINDOW.reminderType,
          },
        });

        summary.dispatchedCount++;
        await sleep(SEND_THROTTLE_MS);
      } catch (err) {
        summary.errors.push(
          `Failed sending ${URGENT_WINDOW.reminderType} to ${opp.user.email}: ${toMessage(err)}`
        );
      }
    }

    return summary;
  }

  /**
   * Users with at least one active upcoming deadline, with their opportunities
   * and existing reminder logs preloaded.
   */
  private async fetchDigestCandidates(now: Date) {
    const deadlineFloor = deadlineLookbackFloor(now);
    const activeOpportunities = {
      deadline: { gte: deadlineFloor },
      status: ACTIVE_STATUS_FILTER,
    };

    const users = await prisma.user.findMany({
      where: {
        email: { not: null },
        opportunities: { some: activeOpportunities },
      },
      select: {
        id: true,
        email: true,
        name: true,
        timezone: true,
        lastDigestDate: true,
        opportunities: {
          where: activeOpportunities,
          select: { id: true, title: true, organization: true, deadline: true },
        },
        reminderLogs: { select: { opportunityId: true, reminderType: true } },
      },
    });

    return users.map((user) => ({
      ...user,
      sentKeys: new Set(
        user.reminderLogs.map((log) => `${log.opportunityId}:${log.reminderType}`)
      ),
    }));
  }
}

/**
 * Lower bound for deadlines worth scanning.
 *
 * Offset a day and a half behind `now` rather than using `now` directly: UTC
 * offsets span -12 to +14, so a deadline already past in UTC can still be
 * "today" for a user far enough behind, and they should still get the
 * due-today notice. calendarDaysUntil does the precise per-user filtering.
 */
function deadlineLookbackFloor(now: Date): Date {
  return new Date(now.getTime() - 36 * 60 * 60 * 1000);
}

function toMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
