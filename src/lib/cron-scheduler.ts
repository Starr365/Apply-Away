import cron from "node-cron";
import { ReminderSchedulerService } from "@/services/reminder-scheduler.service";

const schedulerService = new ReminderSchedulerService();

/**
 * Initialize node-cron background task runner.
 * Runs at minute 0 of every hour (0 * * * *).
 */
export function initCronScheduler() {
  if (process.env.NODE_ENV === "production" && !process.env.ENABLE_NODE_CRON) {
    console.log("[NodeCron] Skipping node-cron in production (Vercel Cron Route active).");
    return;
  }

  console.log("[NodeCron] Initializing persistent reminder background scheduler...");

  // Schedule task to run every hour at minute 0
  cron.schedule("0 * * * *", async () => {
    console.log("[NodeCron] Running hourly deadline reminder scan...");
    try {
      const summary = await schedulerService.processReminders();
      console.log(
        `[NodeCron Summary] Scanned: ${summary.scannedCount}, Dispatched: ${summary.dispatchedCount}, Skipped: ${summary.skippedCount}`
      );
      if (summary.errors.length > 0) {
        console.warn("[NodeCron Errors]:", summary.errors);
      }
    } catch (err) {
      console.error("[NodeCron Exception]:", err);
    }
  });
}
