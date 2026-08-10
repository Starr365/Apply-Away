"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  Target,
  Filter,
  Zap,
  Users,
  ArrowLeft,
  Menu,
  X,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

export type AdminTabKey =
  | "overview"
  | "traffic"
  | "campaigns"
  | "funnel"
  | "usage"
  | "growth";

interface AdminSidebarProps {
  activeTab: AdminTabKey;
  onSelectTab: (tab: AdminTabKey) => void;
}

export const ADMIN_TABS: {
  key: AdminTabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    key: "overview",
    label: "Overview & Decisions",
    icon: LayoutDashboard,
    description: "Primary KPIs and reflection insights",
  },
  {
    key: "traffic",
    label: "Traffic & Channels",
    icon: TrendingUp,
    description: "Visitor trends & traffic sources",
  },
  {
    key: "campaigns",
    label: "UTM Campaigns",
    icon: Target,
    description: "Campaign performance & activation",
  },
  {
    key: "funnel",
    label: "Conversion Funnel",
    icon: Filter,
    description: "Visitor to activated user drop-off",
  },
  {
    key: "usage",
    label: "Feature Engagement",
    icon: Zap,
    description: "Product event distribution",
  },
  {
    key: "growth",
    label: "User Growth & Stream",
    icon: Users,
    description: "User velocity & live activity log",
  },
];

export function AdminSidebar({ activeTab, onSelectTab }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Drawer Trigger Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <BarChart3 className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-foreground font-outfit">
            Owner Cockpit
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground transition-all cursor-pointer"
          title="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-card/80 backdrop-blur-2xl border-r border-border/80 flex flex-col justify-between p-4 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-sky-500 flex items-center justify-center text-white shadow-md shadow-primary/20">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold font-outfit text-base tracking-tight text-foreground">
                  Apply Away
                </h1>
                <p className="text-xs text-primary font-mono font-medium">Owner Cockpit</p>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </div>
          </div>

          <div className="h-px bg-border/60" />

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Admin Dashboard Navigation">
            <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Analytics Modules
            </div>

            {ADMIN_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    onSelectTab(tab.key);
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-2xl transition-all duration-200 flex items-center space-x-3 group cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 border border-primary/40"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-transparent"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs tracking-tight truncate">{tab.label}</p>
                    <p
                      className={`text-[10px] truncate ${
                        isActive ? "text-primary-foreground/80" : "text-muted-foreground/70"
                      }`}
                    >
                      {tab.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border/60 space-y-3">
          <Link
            href="/dashboard"
            className="w-full px-3 py-2.5 rounded-2xl bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border flex items-center justify-center space-x-2 text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to User Dashboard</span>
          </Link>

          <p className="text-[10px] text-center text-muted-foreground/60">
            Apply Away &copy; {new Date().getFullYear()} Private Owner Cockpit
          </p>
        </div>
      </aside>
    </>
  );
}
