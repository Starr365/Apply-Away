/**
 * Resolve the public base URL used in outbound emails and deep links.
 *
 * Prefers NEXT_PUBLIC_APP_URL (the same variable src/app/layout.tsx uses for
 * metadataBase) so email links and page metadata never disagree. Falls back to
 * NEXTAUTH_URL, then localhost for development.
 */
export function getAppUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  return raw.trim().replace(/\/+$/, "");
}
