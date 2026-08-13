/**
 * Resolve the public base URL used in outbound emails and deep links.
 *
 * Prefers NEXT_PUBLIC_APP_URL (the same variable src/app/layout.tsx uses for
 * metadataBase) so email links and page metadata never disagree. Falls back to
 * NEXTAUTH_URL, then localhost for development.
 */
/** Deployed production origin. Used when no environment override is present. */
export const PRODUCTION_APP_URL = "https://apply-away.vercel.app";

export function getAppUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.NODE_ENV === "production"
      ? PRODUCTION_APP_URL
      : "http://localhost:3000");

  return raw.trim().replace(/\/+$/, "");
}
