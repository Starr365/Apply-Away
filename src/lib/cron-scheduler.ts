import cron from "node-cron";
import { ReminderSchedulerService } from "@/services/reminder-scheduler.service";

const schedulerService = new ReminderSchedulerService();

let started = false;

/**
 * In-process hourly reminder scan for local development and self-hosted
 * deployments, where the Node process stays alive.
 *
 * On Vercel this is skipped: serverless functions are torn down between
 * requests, so the schedule would never fire. The hourly trigger there is the
 * GitHub Actions workflow in .github/workflows/reminders.yml, which calls
 * /api/cron/reminders. Set ENABLE_NODE_CRON=1 to force it on anyway.
 */
export function initCronScheduler() {
  if (process.env.VERCEL && !process.env.ENABLE_NODE_CRON) {
    console.log("[NodeCron] Skipping node-cron on Vercel (external cron trigger active).");
    return;
  }

  if (started) return;
  started = true;

  console.log("[NodeCron] Initializing hourly reminder scheduler...");

  // Hourly at minute 0. The scheduler itself decides which users have reached
  // their local 7am, so an hourly tick is all that is needed.
  cron.schedule("0 * * * *", async () => {
    const now = new Date();
    console.log(`[NodeCron] Running reminder scan at ${now.toISOString()}`);

    try {
      const digest = await schedulerService.processDailyDigests(now);
      const urgent = await schedulerService.processUrgentAlerts(now);

      console.log(
        `[NodeCron Summary] digest — scanned: ${digest.scannedCount}, sent: ${digest.dispatchedCount}, skipped: ${digest.skippedCount} | ` +
          `urgent — scanned: ${urgent.scannedCount}, sent: ${urgent.dispatchedCount}, skipped: ${urgent.skippedCount}`
      );

      const errors = [...digest.errors, ...urgent.errors];
      if (errors.length > 0) {
        console.warn("[NodeCron Errors]:", errors);
      }
    } catch (err) {
      console.error("[NodeCron Exception]:", err);
    }
  });
}
