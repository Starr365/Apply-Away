import { NextResponse } from "next/server";
import { ReminderSchedulerService } from "@/services/reminder-scheduler.service";

const scheduler = new ReminderSchedulerService();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const authHeader = request.headers.get("authorization");

  const expectedSecret = process.env.CRON_SECRET;

  // Verify secret if set in environment
  if (expectedSecret) {
    const isAuthorized =
      secret === expectedSecret || authHeader === `Bearer ${expectedSecret}`;
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized cron trigger." }, { status: 401 });
    }
  }

  try {
    const summary = await scheduler.processReminders();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
    });
  } catch (err: unknown) {
    console.error("Cron Reminder Job failed:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Cron execution failed." },
      { status: 500 }
    );
  }
}
