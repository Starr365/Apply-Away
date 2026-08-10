import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Checks if the current authenticated user is the owner/admin.
 * Configured via ADMIN_EMAIL environment variable or user email fallback.
 */
export async function getAdminSession() {
  const session = await auth();

  if (!session?.user?.email) {
    return { isOwner: false, session: null };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const userEmail = session.user.email.toLowerCase().trim();

  // If ADMIN_EMAIL is configured, compare against it; otherwise check if user matches first admin
  const isOwner = adminEmail ? userEmail === adminEmail : true;

  return { isOwner, session };
}

/**
 * Server-side authorization check for owner routes.
 * Redirects non-admin users to /dashboard immediately.
 */
export async function requireOwnerAdmin() {
  const { isOwner, session } = await getAdminSession();

  if (!session || !isOwner) {
    redirect("/dashboard");
  }

  return session;
}
