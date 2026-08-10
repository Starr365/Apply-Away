import type { Metadata } from "next";
import { requireOwnerAdmin } from "@/lib/auth-admin";
import Link from "next/link";
import { Shield, ArrowLeft, BarChart3 } from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Admin Topbar */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
              title="Return to user dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="font-extrabold font-outfit text-base tracking-tight text-foreground">
                Apply Away <span className="text-primary text-xs font-mono font-normal">/ Admin Cockpit</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Shield className="w-3 h-3" />
              <span>Owner Private Mode</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {children}
      </main>
    </div>
  );
}
