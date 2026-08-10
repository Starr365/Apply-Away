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

interface AdminAnalyticsViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: Record<string, any>;
  initialRange: DateRangeKey;
}

export function AdminAnalyticsView({ initialData, initialRange }: AdminAnalyticsViewProps) {
  const toast = useToast();
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

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Range Controls */}
      <PageHeader
        title="Owner Cockpit & Marketing Analytics"
        description="Private decision-driven analytics for Apply Away acquisition and user growth."
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

      {/* Primary KPI Summary Cards */}
      <PrimaryKPICards kpis={data.kpis} />

      {/* Growth Reflection Decision Engine */}
      <OwnerReflection reflection={data.reflection} />

      {/* Traffic Analytics Chart */}
      <TrafficChart data={data.trafficAnalytics} />

      {/* Traffic Sources & Signup Funnel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficSources sources={data.trafficSources} />
        <SignupFunnel funnel={data.signupFunnel} />
      </div>

      {/* UTM Campaigns & Core Product Usage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UtmCampaigns campaigns={data.utmCampaigns} />
        <ProductUsage usage={data.productUsage} />
      </div>

      {/* User Growth & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart growth={data.userGrowth} />
        <RecentActivityFeed activity={data.recentActivity} />
      </div>
    </div>
  );
}
