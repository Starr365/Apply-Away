import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId, getUtmAttribution } from "@/lib/analytics-cookies";

export type AnalyticsEventName =
  | "page_view"
  | "sign_up"
  | "login"
  | "opportunity_saved"
  | "ai_extraction_used"
  | "opportunity_viewed"
  | "calendar_viewed"
  | "status_updated";

export interface TrackEventInput {
  eventName: AnalyticsEventName;
  userId?: string | null;
  sessionId?: string | null;
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  metadata?: Record<string, any> | null;
}

/**
 * Centralized, DRY server-side analytics tracking function.
 * ALL application event insertions into PostgreSQL MUST pass through this function.
 */
export async function trackEvent(input: TrackEventInput): Promise<void> {
  try {
    const { eventName, userId, metadata } = input;

    // Resolve or fallback sessionId & UTM attribution
    const sessionId = input.sessionId || (await getOrCreateSessionId());
    const storedUtm = await getUtmAttribution();

    const source = input.source ?? storedUtm.source ?? null;
    const medium = input.medium ?? storedUtm.medium ?? null;
    const campaign = input.campaign ?? storedUtm.campaign ?? null;

    await prisma.analyticsEvent.create({
      data: {
        eventName,
        userId: userId || null,
        sessionId: sessionId || null,
        source: source || null,
        medium: medium || null,
        campaign: campaign || null,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    });
  } catch (error) {
    // Fail silently in production so analytics never disrupts core user workflows
    console.error("[Analytics] Event tracking error:", error);
  }
}
