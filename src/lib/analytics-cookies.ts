import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "aa_session_id";
const UTM_COOKIE_NAME = "aa_utm";

export interface UtmAttribution {
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
}

/**
 * Retrieves the current anonymous sessionId or generates a new privacy-conscious UUID
 * and sets it as an HTTP cookie if not already set.
 */
export async function getOrCreateSessionId(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const existingSession = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (existingSession) {
      return existingSession;
    }

    const newSessionId = crypto.randomUUID();
    cookieStore.set(SESSION_COOKIE_NAME, newSessionId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return newSessionId;
  } catch {
    // Return a transient random ID if cookieStore cannot be modified (e.g. read-only context)
    return crypto.randomUUID();
  }
}

/**
 * Persists first-touch UTM parameters into an HTTP cookie if not already captured.
 */
export async function captureUtmAttribution(params: {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}): Promise<UtmAttribution> {
  const { utm_source, utm_medium, utm_campaign } = params;

  try {
    const cookieStore = await cookies();
    const existingUtmRaw = cookieStore.get(UTM_COOKIE_NAME)?.value;

    if (existingUtmRaw) {
      try {
        return JSON.parse(existingUtmRaw) as UtmAttribution;
      } catch {
        // Fall back if cookie corrupted
      }
    }

    if (utm_source || utm_medium || utm_campaign) {
      const attribution: UtmAttribution = {
        source: utm_source || null,
        medium: utm_medium || null,
        campaign: utm_campaign || null,
      };

      cookieStore.set(UTM_COOKIE_NAME, JSON.stringify(attribution), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 90, // 90 days first-touch memory
        path: "/",
      });

      return attribution;
    }
  } catch {
    // Ignore cookie write errors in read-only render contexts
  }

  return { source: utm_source || null, medium: utm_medium || null, campaign: utm_campaign || null };
}

/**
 * Retrieves persisted first-touch UTM attribution from cookies.
 */
export async function getUtmAttribution(): Promise<UtmAttribution> {
  try {
    const cookieStore = await cookies();
    const existingUtmRaw = cookieStore.get(UTM_COOKIE_NAME)?.value;

    if (existingUtmRaw) {
      return JSON.parse(existingUtmRaw) as UtmAttribution;
    }
  } catch {
    // Ignore read errors
  }

  return { source: null, medium: null, campaign: null };
}
