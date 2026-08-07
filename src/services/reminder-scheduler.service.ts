import { prisma } from "@/lib/prisma";
import { EmailService } from "./email.service";
import { formatInUserTimezone } from "@/lib/timezone";

export interface ReminderCheckSummary {
  scannedCount: number;
  dispatchedCount: number;
  skippedCount: number;
  errors: string[];
}

export type ReminderType = "14_DAYS" | "7_DAYS" | "3_DAYS" | "24_HOURS" | "12_HOURS";

const REMINDER_CONFIG: Record<
  ReminderType,
  { label: string; minMs: number; maxMs: number }
> = {
  "14_DAYS": {
    label: "14 Days Remaining",
    minMs: 13.5 * 24 * 60 * 60 * 1000,
    maxMs: 14.5 * 24 * 60 * 60 * 1000,
  },
  "7_DAYS": {
    label: "7 Days Remaining",
    minMs: 6.5 * 24 * 60 * 60 * 1000,
    maxMs: 7.5 * 24 * 60 * 60 * 1000,
  },
  "3_DAYS": {
    label: "3 Days Remaining",
    minMs: 2.5 * 24 * 60 * 60 * 1000,
    maxMs: 3.5 * 24 * 60 * 60 * 1000,
  },
  "24_HOURS": {
    label: "24 Hours Remaining",
    minMs: 20 * 60 * 60 * 1000,
    maxMs: 28 * 60 * 60 * 1000,
  },
  "12_HOURS": {
    label: "12 Hours Remaining",
    minMs: 8 * 60 * 60 * 1000,
    maxMs: 14 * 60 * 60 * 1000,
  },
};

export class ReminderSchedulerService {
  private emailService = new EmailService();

  async processReminders(): Promise<ReminderCheckSummary> {
    const summary: ReminderCheckSummary = {
      scannedCount: 0,
      dispatchedCount: 0,
      skippedCount: 0,
      errors: [],
    };

    const now = new Date();

    try {
      // Query active opportunities with deadlines that are NOT submitted/accepted/rejected
      const opportunities = await prisma.opportunity.findMany({
        where: {
          deadline: { gte: now },
          status: {
            notIn: ["SUBMITTED", "ACCEPTED", "REJECTED"],
          },
        },
        include: {
          user: true,
          reminderLogs: true,
        },
      });

      summary.scannedCount = opportunities.length;

      for (const opp of opportunities) {
        if (!opp.deadline || !opp.user?.email) continue;

        const timeDiff = opp.deadline.getTime() - now.getTime();
        const userTimezone = opp.user.timezone || "Africa/Lagos";

        // Check each reminder milestone window
        for (const [typeKey, config] of Object.entries(REMINDER_CONFIG)) {
          const reminderType = typeKey as ReminderType;

          // Check if timeDiff falls within this window
          if (timeDiff >= config.minMs && timeDiff <= config.maxMs) {
            // Check if reminder was already sent
            const alreadySent = opp.reminderLogs.some(
              (log) => log.reminderType === reminderType
            );

            if (alreadySent) {
              summary.skippedCount++;
              continue;
            }

            // Format deadline in user's timezone
            const formattedDeadline = formatInUserTimezone(
              opp.deadline,
              userTimezone,
              "eeee, MMMM d, yyyy 'at' h:mm a (zzz)"
            );

            try {
              // Dispatch email
              await this.emailService.sendReminderEmail({
                toEmail: opp.user.email,
                userName: opp.user.name || "User",
                opportunityTitle: opp.title,
                organization: opp.organization,
                reminderTypeLabel: config.label,
                deadlineFormatted: formattedDeadline,
                userTimezone,
                opportunityUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/opportunities/${opp.id}`,
              });

              // Create idempotency log
              await prisma.reminderLog.create({
                data: {
                  userId: opp.userId,
                  opportunityId: opp.id,
                  reminderType,
                },
              });

              summary.dispatchedCount++;
            } catch (err: unknown) {
              const errMsg = err instanceof Error ? err.message : String(err);
              summary.errors.push(`Failed sending ${reminderType} to ${opp.user.email}: ${errMsg}`);
            }
          }
        }
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`Database scan error: ${errMsg}`);
    }

    return summary;
  }
}
