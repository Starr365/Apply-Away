"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Shield,
} from "lucide-react";
import type { Session } from "next-auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  session: Session | null;
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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      label: "Vault Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Deadline Calendar",
      href: "/calendar",
      icon: Calendar,
    },
    {
      label: "Reflection & Analytics",
      href: "/reflection",
      icon: BarChart3,
    },
    {
      label: "Profile & Settings",
      href: "/profile",
      icon: User,
    },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Skip to Content – Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-9999 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-purple-600 focus:text-white focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* ========================================================================= */}
      {/* MOBILE TOP BAR (md:hidden) */}
      {/* ========================================================================= */}
      <header className="md:hidden border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/dashboard" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-outfit font-bold text-lg text-white">Apply Away</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* MOBILE OVERLAY BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-45 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION (Desktop persistent + Mobile drawer) */}
      {/* ========================================================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="h-16 px-6 border-b border-slate-800/60 flex items-center justify-between">
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center space-x-3"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="font-outfit font-bold text-xl tracking-tight text-white">
                Apply Away
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Sidebar Navigation">
            {showBackButton && (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors mb-3"
              >
                <ArrowLeft className="w-4 h-4 text-purple-400" aria-hidden="true" />
                <span>Back to Dashboard</span>
              </Link>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-purple-600/15 border border-purple-500/40 text-white shadow-xs font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-purple-400" : "text-slate-400"}`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Profile & Log Out */}
        <div className="p-4 border-t border-slate-800/60 space-y-3 bg-slate-950">
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
              {session?.user?.name ? session.user.name.charAt(0) : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {session?.user?.name || "Apply Away User"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {session?.user?.email || "Encrypted Vault Session"}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out</span>
          </button>

          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-500 pt-1">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Multi-Tenant Vault</span>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 min-h-screen justify-between">
        <main id="main-content" className={`${maxWidth} mx-auto px-4 sm:px-6 py-8 flex-1 w-full`} role="main">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/60 py-6 bg-slate-950/60" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
            Apply Away &copy; {new Date().getFullYear()}
            {footerLabel ? ` – ${footerLabel}` : " – Multi-Tenant Opportunity Vault"}
          </div>
        </footer>
      </div>
    </div>
  );
}

