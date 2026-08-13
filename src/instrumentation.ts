/**
 * Next.js instrumentation hook — runs once per server process at startup.
 * This is what actually starts the in-process reminder scheduler; without it
 * initCronScheduler() is never called.
 */
export async function register() {
  // Guard against the edge runtime, where node-cron cannot load.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { initCronScheduler } = await import("@/lib/cron-scheduler");
  initCronScheduler();
}
