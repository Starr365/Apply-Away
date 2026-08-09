"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "@/components/providers/theme-provider";
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  Sun,
  Moon,
} from "lucide-react";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
  session: Session | null;
  /** Footer subtitle text after the year (e.g. "Deadline Calendar") */
  footerLabel?: string;
  /** Optional max-width override for main content (default: "max-w-7xl") */
  maxWidth?: string;
}

export function DashboardLayout({
  children,
  session,
  footerLabel,
  maxWidth = "max-w-7xl",
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      label: "Opportunity Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Calendar View",
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
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row transition-colors duration-300">
      {/* Skip to Content – Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-9999 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* ========================================================================= */}
      {/* MOBILE TOP BAR (md:hidden) */}
      {/* ========================================================================= */}
      <header className="md:hidden border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-40 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/vault-logo.png"
                alt="Apply Away Logo"
                fill
                sizes="40px"
                priority
                className="object-contain"
              />
            </div>
            <span className="font-outfit font-bold text-lg text-foreground">Apply Away</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-xl border border-border bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-background/80 backdrop-blur-xs z-45 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION (Desktop persistent + Mobile drawer) */}
      {/* ========================================================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-background md:bg-card border-r border-border flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="h-16 px-6 border-b border-border flex items-center justify-between">
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center space-x-2.5"
            >
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/vault-logo.png"
                  alt="Apply Away Logo"
                  fill
                  sizes="40px"
                  priority
                  className="object-contain"
                />
              </div>
              <span className="font-outfit font-bold text-xl tracking-tight text-foreground">
                Apply Away
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Sidebar Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href)) ||
                (item.href === "/dashboard" && pathname.startsWith("/opportunities"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? "bg-primary/20 border border-primary text-primary font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
                    }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Profile, Theme Toggle & Log Out */}
        <div className="p-4 border-t border-border space-y-3 bg-background md:bg-card">
          {/* Theme Toggle Button in Sidebar (Mobile Only) */}
          <button
            onClick={toggleTheme}
            type="button"
            className="md:hidden w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-border bg-secondary/50 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-all cursor-pointer"
          >
            <span className="flex items-center space-x-2">
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-primary" />
              )}
              <span>{theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              {theme}
            </span>
          </button>

          {/* Account Profile Session (Mobile Only) */}
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            className="md:hidden flex items-center space-x-3 p-2.5 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground uppercase">
              {session?.user?.name ? session.user.name.charAt(0) : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {session?.user?.name || "Apply Away User"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {session?.user?.email || "Encrypted Vault Session"}
              </p>
            </div>
          </Link>

          <Button
            variant="destructive"
            size="md"
            onClick={handleSignOut}
            leftIcon={<LogOut className="w-4 h-4 text-white" />}
            className="w-full justify-center text-xs font-extrabold"
          >
            Sign Out
          </Button>

          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-muted-foreground pt-1">
            <Shield className="w-3 h-3 text-primary" />
            <span>Opportunity Vault</span>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 min-h-screen justify-between">
        {/* Desktop top header */}
        <header className="hidden md:flex h-16 border-b border-border bg-card/70 backdrop-blur-md sticky top-0 z-30 px-8 items-center justify-between transition-colors duration-300">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Welcome back,
            </span>
            <span className="text-xs font-bold text-foreground">
              {session?.user?.name || "Apply Away User"}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-xl border border-border bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-primary" />
              )}
            </button>

            <Link
              href="/profile"
              className="flex items-center space-x-2.5 p-1 px-2.5 rounded-xl border border-border hover:border-primary transition-all bg-secondary"
            >
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground uppercase">
                {session?.user?.name ? session.user.name.charAt(0) : "U"}
              </div>
              <span className="text-[11px] font-semibold text-foreground">
                Profile Settings
              </span>
            </Link>
          </div>
        </header>

        <main id="main-content" className={`${maxWidth} mx-auto px-4 sm:px-6 py-8 flex-1 w-full`} role="main">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-6 bg-secondary/30" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-muted-foreground">
            Apply Away &copy; {new Date().getFullYear()}
            {footerLabel ? ` – ${footerLabel}` : " – Opportunity Vault"}
          </div>
        </footer>
      </div>
    </div>
  );
}

