import type { Metadata } from "next";
import { requireOwnerAdmin } from "@/lib/auth-admin";


export const metadata: Metadata = {
  title: "Owner Cockpit Analytics – Apply Away",
  description: "Private marketing and product analytics for Apply Away owner.",
};

export default async function AdminAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authorization check (redirects to /dashboard if unauthorized)
  await requireOwnerAdmin();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {children}
    </div>
  );
}
