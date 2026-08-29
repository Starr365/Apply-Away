import { NextResponse } from "next/server";
import { ReminderSchedulerService } from "@/services/reminder-scheduler.service";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const scheduler = new ReminderSchedulerService();

type Pass = "digest" | "urgent" | "all";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const expectedSecret = process.env.CRON_SECRET;

  // Fail closed. An unauthenticated reminder endpoint lets anyone trigger a
  // full email blast, so a missing secret is a misconfiguration, not a bypass.
  if (!expectedSecret) {
    logger.error("[Cron] CRON_SECRET is not configured; refusing to run.");
    return NextResponse.json(
      { success: false, error: "Cron endpoint is not configured." },
      { status: 500 }
    );
  }

  const secret = searchParams.get("secret");
  const authHeader = request.headers.get("authorization");
  const isAuthorized = secret === expectedSecret || authHeader === `Bearer ${expectedSecret}`;

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized cron trigger." }, { status: 401 });
  }

  const passParam = (searchParams.get("pass") || "all") as Pass;
  if (!["digest", "urgent", "all"].includes(passParam)) {
    return NextResponse.json(
      { success: false, error: `Unknown pass "${passParam}". Use digest, urgent, or all.` },
      { status: 400 }
    );
  }

  const now = new Date();

  try {
    const digest =
      passParam === "digest" || passParam === "all"
        ? await scheduler.processDailyDigests(now)
        : null;

    const urgent =
      passParam === "urgent" || passParam === "all"
        ? await scheduler.processUrgentAlerts(now)
        : null;

    const errors = [...(digest?.errors ?? []), ...(urgent?.errors ?? [])];
    if (errors.length > 0) {
      logger.warn("[Cron] Reminder pass completed with errors:", errors);
    }

    return NextResponse.json({
      success: errors.length === 0,
      timestamp: now.toISOString(),
      pass: passParam,
      digest,
      urgent,
    });
  } catch (err: unknown) {
    logger.error("Cron Reminder Job failed:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Cron execution failed." },
      { status: 500 }
    );
  }
}
