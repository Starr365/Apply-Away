"use client";

import { useState, useTransition } from "react";
import { DateRangeKey } from "@/services/admin-analytics.service";
import { getOwnerAnalyticsDataAction } from "@/app/actions/admin-analytics.actions";
import { DateRangePicker } from "./date-range-picker";
import { PrimaryKPICards } from "./primary-kpi-cards";
import { TrafficChart } from "./traffic-chart";
import { TrafficSources } from "./traffic-sources";
import { UtmCampaigns } from "./utm-campaigns";
import { SignupFunnel } from "./signup-funnel";
import { ProductUsage } from "./product-usage";
import { UserGrowthChart } from "./user-growth-chart";
import { OwnerReflection } from "./owner-reflection";
import { RecentActivityFeed } from "./recent-activity-feed";
import { PageHeader } from "@/components/ui/page-header";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

import { AdminSidebar, AdminTabKey, ADMIN_TABS } from "./admin-sidebar";

interface AdminAnalyticsViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: Record<string, any>;
  initialRange: DateRangeKey;
}

export function AdminAnalyticsView({ initialData, initialRange }: AdminAnalyticsViewProps) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<AdminTabKey>("overview");
  const [range, setRange] = useState<DateRangeKey>(initialRange);
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const handleRangeChange = (newRange: DateRangeKey) => {
    setRange(newRange);
    startTransition(async () => {
      const res = await getOwnerAnalyticsDataAction(newRange);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        toast.error(res.error || "Failed to update analytics data.");
      }
    });
  };

  const handleRefresh = () => {
    handleRangeChange(range);
  };

  const currentTabInfo = ADMIN_TABS.find((t) => t.key === activeTab) || ADMIN_TABS[0];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Vertical Left Sidebar */}
      <AdminSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8 overflow-y-auto">
        {/* Top Header & Range Controls */}
        <PageHeader
          title={currentTabInfo.label}
          description={currentTabInfo.description}
        >
          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Owner Access Verified</span>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isPending}
              className="h-10 w-10 rounded-xl bg-secondary hover:bg-secondary/80 border border-border flex items-center justify-center text-foreground transition-all cursor-pointer disabled:opacity-50"
              title="Refresh metrics"
            >
              <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin text-primary" : ""}`} />
            </button>

            <DateRangePicker currentRange={range} onChangeRange={handleRangeChange} />
          </div>
        </PageHeader>

        {/* Tab 1: Overview & Decisions */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <PrimaryKPICards kpis={data.kpis} />
            <OwnerReflection reflection={data.reflection} />
            <TrafficChart data={data.trafficAnalytics} />
          </div>
        )}

        {/* Tab 2: Traffic & Channels */}
        {activeTab === "traffic" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <TrafficChart data={data.trafficAnalytics} />
            <TrafficSources sources={data.trafficSources} />
          </div>
        )}

        {/* Tab 3: UTM Campaigns */}
        {activeTab === "campaigns" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <UtmCampaigns campaigns={data.utmCampaigns} />
          </div>
        )}

        {/* Tab 4: Conversion Funnel */}
        {activeTab === "funnel" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <SignupFunnel funnel={data.signupFunnel} />
          </div>
        )}

        {/* Tab 5: Feature Engagement */}
        {activeTab === "usage" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <ProductUsage usage={data.productUsage} />
          </div>
        )}

        {/* Tab 6: User Growth & Stream */}
        {activeTab === "growth" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <UserGrowthChart growth={data.userGrowth} />
            <RecentActivityFeed activity={data.recentActivity} />
          </div>
        )}
      </main>
    </div>
  );
}
