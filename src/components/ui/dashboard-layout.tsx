import Link from "next/link";
import { Sparkles, ArrowLeft, User } from "lucide-react";
import type { Session } from "next-auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  session: Session;
  /** Footer subtitle text after the year (e.g. "Deadline Calendar") */
  footerLabel?: string;
  /** Show "Back to Vault Dashboard" button */
  showBackButton?: boolean;
  /** Optional max-width override for main content (default: "max-w-7xl") */
  maxWidth?: string;
}

export function DashboardLayout({
  children,
  session,
  footerLabel,
  showBackButton = false,
  maxWidth = "max-w-7xl",
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Skip to Content – Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-purple-600 focus:text-white focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header
        className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" aria-label="Go to Dashboard">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
            </Link>
            <Link
              href="/dashboard"
              className="font-outfit font-bold text-xl tracking-tight text-white"
            >
              Apply Away
            </Link>
          </div>

          <nav className="flex items-center space-x-4" aria-label="Primary navigation">
            {showBackButton && (
              <Link
                href="/dashboard"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
                <span>Vault Dashboard</span>
              </Link>
            )}

            <Link
              href="/profile"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all"
              aria-label="User profile"
            >
              <User className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
              <span>{session.user?.name || "Profile"}</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className={`${maxWidth} mx-auto px-4 sm:px-6 py-8 flex-1 w-full`}
        role="main"
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        className="border-t border-slate-800/60 py-6 bg-slate-950/60"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Apply Away &copy; {new Date().getFullYear()}
          {footerLabel ? ` – ${footerLabel}` : " – Multi-Tenant Opportunity Vault"}
        </div>
      </footer>
    </div>
  );
}
