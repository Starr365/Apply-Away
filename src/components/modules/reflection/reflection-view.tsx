"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast-provider";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { MetricCard } from "@/components/ui/metric-card";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { saveMonthlyReflectionAction } from "@/app/actions/reflection.actions";
import dynamic from "next/dynamic";

const ApplicationVelocityChart = dynamic(
  () => import("./charts/application-velocity-chart").then((mod) => mod.ApplicationVelocityChart),
  { ssr: false }
);
const CategoryPieChart = dynamic(
  () => import("./charts/category-pie-chart").then((mod) => mod.CategoryPieChart),
  { ssr: false }
);
const StatusConversionChart = dynamic(
  () => import("./charts/status-conversion-chart").then((mod) => mod.StatusConversionChart),
  { ssr: false }
);
import { ActivityLog } from "@/domain/opportunity.types";
import {
  TrendingUp,
  Award,
  BookOpen,
  History,
  Save,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
} from "lucide-react";

interface MonthlyReflectionItem {
  id: string;
  monthYear: string;
  content: string;
}

interface ReflectionViewProps {
  velocityData: { month: string; total: number; submitted: number }[];
  categoryData: { name: string; value: number }[];
  statusData: { status: string; count: number }[];
  recentActivities: ActivityLog[];
  reflectionsMap: Record<string, MonthlyReflectionItem>;
  stats: {
    totalApplications: number;
    submittedThisMonth: number;
    acceptanceRate: string;
    topCategory: string;
  };
}

export function ReflectionView({
  velocityData,
  categoryData,
  statusData,
  recentActivities,
  reflectionsMap,
  stats,
}: ReflectionViewProps) {
  const toast = useToast();
  const currentMonthYear = new Date().toISOString().slice(0, 7); // e.g. "2026-08"
  const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);
  const [reflectionText, setReflectionText] = useState(
    reflectionsMap[currentMonthYear]?.content || ""
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setReflectionText(reflectionsMap[month]?.content || "");
  };

  const handleSaveReflection = async () => {
    setIsSaving(true);

    try {
      const res = await saveMonthlyReflectionAction(selectedMonth, reflectionText);
      if (res.success) {
        toast.success(`Reflection notes saved for ${selectedMonth}!`);
      } else {
        toast.error(res.error || "Failed to save reflection.");
      }
    } catch (err) {
      console.error("Failed to save reflection:", err);
      toast.error("Failed to save reflection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Metrics Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AnimatedContainer delay={0}>
          <MetricCard
            label="Total Vault"
            value={stats.totalApplications}
            icon={BookOpen}
            iconColorClass="text-primary"
          />
        </AnimatedContainer>
        <AnimatedContainer delay={60}>
          <MetricCard
            label="Submitted (This Month)"
            value={stats.submittedThisMonth}
            icon={BarChart3}
            iconColorClass="text-emerald-600 dark:text-emerald-400"
            valueColorClass="text-emerald-600 dark:text-emerald-400"
          />
        </AnimatedContainer>
        <AnimatedContainer delay={120}>
          <MetricCard
            label="Acceptance Rate"
            value={stats.acceptanceRate}
            icon={Award}
            iconColorClass="text-amber-600 dark:text-amber-400"
            valueColorClass="text-amber-600 dark:text-amber-400"
          />
        </AnimatedContainer>
        <AnimatedContainer delay={180}>
          <MetricCard
            label="Top Category"
            value={stats.topCategory}
            icon={TrendingUp}
            iconColorClass="text-sky-600 dark:text-sky-400"
            valueColorClass="text-sky-600 dark:text-sky-400"
          />
        </AnimatedContainer>
      </div>

      {/* Responsive Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Application Velocity Over Time */}
        <AnimatedContainer delay={200}>
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" aria-hidden="true" />
              <h3 className="text-base font-bold font-outfit text-foreground">Application Velocity</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly trend of new opportunities created vs. submitted applications over time.
            </p>
            <ErrorBoundary fallbackTitle="Chart Error" fallbackDescription="Unable to render the velocity chart.">
              <ApplicationVelocityChart data={velocityData} />
            </ErrorBoundary>
          </div>
        </AnimatedContainer>

        {/* Chart 2: Category Breakdown */}
        <AnimatedContainer delay={260}>
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2">
              <PieIcon className="w-5 h-5 text-primary" aria-hidden="true" />
              <h3 className="text-base font-bold font-outfit text-foreground">Category Distribution</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Breakdown of your opportunities across fellowships, grants, scholarships, and jobs.
            </p>
            <ErrorBoundary fallbackTitle="Chart Error" fallbackDescription="Unable to render the category chart.">
              <CategoryPieChart data={categoryData} />
            </ErrorBoundary>
          </div>
        </AnimatedContainer>

        {/* Chart 3: Pipeline Status Conversion */}
        <AnimatedContainer delay={320} className="lg:col-span-2">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-500" aria-hidden="true" />
              <h3 className="text-base font-bold font-outfit text-foreground">Status Conversion Funnel</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Application progression across pipeline stages (Not Started → In Progress → Submitted → Interview → Accepted).
            </p>
            <ErrorBoundary fallbackTitle="Chart Error" fallbackDescription="Unable to render the status chart.">
              <StatusConversionChart data={statusData} />
            </ErrorBoundary>
          </div>
        </AnimatedContainer>
      </div>

      {/* Grid: Monthly Reflection Journal & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Reflection Notes Journal (2 Cols) */}
        <AnimatedContainer delay={380} className="lg:col-span-2">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-primary font-bold text-sm">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  <span>Monthly Reflection Journal</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Log monthly insights, key learnings, networking notes, and goals for future applications.
                </p>
              </div>

              {/* Month Selector */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <label htmlFor="month-selector" className="sr-only">Select month</label>
                <input
                  id="month-selector"
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => handleMonthSelect(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-card border border-input text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
                />
              </div>
            </div>

            <label htmlFor="reflection-textarea" className="sr-only">
              Reflection notes for {selectedMonth}
            </label>
            <textarea
              id="reflection-textarea"
              rows={7}
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder={`Reflect on your career & application progress for ${selectedMonth}... (e.g. What went well this month? What can be improved?)`}
              className="w-full p-4 rounded-2xl bg-card border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveReflection}
                disabled={isSaving}
                className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                aria-label={isSaving ? "Saving reflection" : `Save reflection for ${selectedMonth}`}
              >
                <Save className="w-4 h-4" aria-hidden="true" />
                <span>{isSaving ? "Saving..." : `Save Reflection (${selectedMonth})`}</span>
              </button>
            </div>
          </div>
        </AnimatedContainer>

        {/* Recent Activity Feed (1 Col) */}
        <AnimatedContainer delay={440}>
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2 text-foreground font-bold text-sm">
              <History className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>Recent Audit Feed</span>
            </div>

            {recentActivities.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4" role="status">No recent activity recorded.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1" role="feed" aria-label="Recent activity log">
                {recentActivities.map((act) => (
                  <div key={act.id} className="p-3 rounded-xl bg-card border border-border text-xs space-y-1">
                    <div className="font-semibold text-primary">
                      {act.action.replace(/_/g, " ")}
                    </div>
                    <div className="text-muted-foreground line-clamp-2">{act.description}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(act.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
}
