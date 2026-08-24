"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast-provider";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { MetricCard } from "@/components/ui/metric-card";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PageHeader } from "@/components/ui/page-header";
import { saveMonthlyReflectionAction } from "@/app/actions/reflection.actions";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  CalendarDays,
  Edit3,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthlyReflectionItem {
  id: string;
  monthYear: string;
  content: string;
}

interface ReflectionViewProps {
  velocityData: { period: string; total: number; submitted: number }[];
  categoryData: { name: string; value: number }[];
  statusData: { status: string; count: number }[];
  recentActivities: ActivityLog[];
  reflectionsMap: Record<string, MonthlyReflectionItem>;
  currentView: "monthly" | "yearly";
  selectedMonth: string;
  selectedYear: string;
  availableYears: string[];
  periodLabel: string;
  stats: {
    totalApplications: number;
    submittedThisMonth: number;
    acceptedCount: number;
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
  currentView,
  selectedMonth,
  selectedYear,
  availableYears,
  periodLabel,
  stats,
}: ReflectionViewProps) {
  const router = useRouter();
  const toast = useToast();
  const [savedMap, setSavedMap] = useState<Record<string, MonthlyReflectionItem>>(reflectionsMap);
  const [journalMonth, setJournalMonth] = useState(selectedMonth);
  const [reflectionText, setReflectionText] = useState(
    reflectionsMap[selectedMonth]?.content || ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentSavedContent = savedMap[journalMonth]?.content || "";

  const handleJournalMonthSelect = (month: string) => {
    setJournalMonth(month);
    const content = savedMap[month]?.content || "";
    setReflectionText(content);
    setIsEditing(false);
  };

  const handleDateChange = (newVal: string) => {
    if (currentView === "monthly") {
      router.push(`/reflection?view=monthly&month=${newVal}`);
    } else {
      router.push(`/reflection?view=yearly&year=${newVal}`);
    }
  };

  const handleSaveReflection = async () => {
    if (!reflectionText.trim()) {
      toast.error("Reflection text cannot be empty.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await saveMonthlyReflectionAction(journalMonth, reflectionText);
      if (res.success) {
        toast.success(`Reflection notes saved for ${journalMonth}!`);
        setSavedMap((prev) => ({
          ...prev,
          [journalMonth]: {
            id: res.data?.id || Date.now().toString(),
            monthYear: journalMonth,
            content: reflectionText,
          },
        }));
        setIsEditing(false);
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
    <div className="space-y-6">
      {/* Page Header with Tab Switcher & Date Picker on the Right */}
      <AnimatedContainer delay={0} direction="fade">
        <PageHeader
          title="Reflection & Analytics Dashboard"
          description={`Analyzing metrics for ${periodLabel}. Track application velocity, conversions, and monthly reflections.`}
        >
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Monthly / Yearly Segmented Switcher */}
            <div className="flex items-center rounded-xl bg-secondary border border-border p-1" role="tablist" aria-label="Analytics view mode">
              <Link
                href={`/reflection?view=monthly&month=${selectedMonth}`}
                role="tab"
                aria-selected={currentView === "monthly"}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === "monthly"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
                Monthly
              </Link>
              <Link
                href={`/reflection?view=yearly&year=${selectedYear}`}
                role="tab"
                aria-selected={currentView === "yearly"}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === "yearly"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                Yearly
              </Link>
            </div>

            {/* Date Picker Inline Beside Tab Switcher */}
            {currentView === "monthly" ? (
              <input
                id="header-month-picker"
                type="month"
                value={selectedMonth}
                onChange={(e) => handleDateChange(e.target.value)}
                className="h-9 px-3 rounded-xl bg-card border border-input text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
                title="Select Month"
              />
            ) : (
              <div className="relative">
                <select
                  id="header-year-picker"
                  value={selectedYear}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="h-9 pl-3 pr-8 rounded-xl bg-card border border-input text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer appearance-none font-medium"
                  title="Select Year"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-3 pointer-events-none" aria-hidden="true" />
              </div>
            )}
          </div>
        </PageHeader>
      </AnimatedContainer>

      {/* Metrics Summary Row Scoped to Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AnimatedContainer delay={60}>
          <MetricCard
            label={currentView === "monthly" ? `Created (${periodLabel})` : `Created (${periodLabel})`}
            value={stats.totalApplications}
            icon={BookOpen}
            iconColorClass="text-primary"
          />
        </AnimatedContainer>
        <AnimatedContainer delay={120}>
          <MetricCard
            label={currentView === "monthly" ? `Submitted (${periodLabel})` : `Submitted (${periodLabel})`}
            value={stats.submittedThisMonth}
            icon={BarChart3}
            iconColorClass="text-emerald-600 dark:text-emerald-400"
            valueColorClass="text-emerald-600 dark:text-emerald-400"
          />
        </AnimatedContainer>
        <AnimatedContainer delay={180}>
          <MetricCard
            label={`Acceptance Rate · ${stats.acceptedCount} accepted`}
            value={stats.acceptanceRate}
            icon={Award}
            iconColorClass="text-amber-600 dark:text-amber-400"
            valueColorClass="text-amber-600 dark:text-amber-400"
          />
        </AnimatedContainer>
        <AnimatedContainer delay={240}>
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
        <AnimatedContainer delay={300}>
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" aria-hidden="true" />
              <h3 className="text-base font-bold font-outfit text-foreground">
                Application Velocity ({currentView === "monthly" ? "6-Month Trend" : `Jan–Dec ${selectedYear}`})
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {currentView === "monthly"
                ? `Monthly trend of applications created vs. submitted for the 6 months ending in ${periodLabel}.`
                : `Individual monthly statistics for all 12 months in ${selectedYear}.`}
            </p>
            <ErrorBoundary fallbackTitle="Chart Error" fallbackDescription="Unable to render the velocity chart.">
              <ApplicationVelocityChart data={velocityData} />
            </ErrorBoundary>
          </div>
        </AnimatedContainer>

        {/* Chart 2: Category Breakdown */}
        <AnimatedContainer delay={340}>
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2">
              <PieIcon className="w-5 h-5 text-primary" aria-hidden="true" />
              <h3 className="text-base font-bold font-outfit text-foreground">
                Category Distribution ({periodLabel})
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Breakdown across fellowships, grants, scholarships, and jobs for {periodLabel}.
            </p>
            <ErrorBoundary fallbackTitle="Chart Error" fallbackDescription="Unable to render the category chart.">
              <CategoryPieChart data={categoryData} />
            </ErrorBoundary>
          </div>
        </AnimatedContainer>

        {/* Chart 3: Pipeline Status Conversion */}
        <AnimatedContainer delay={380} className="lg:col-span-2">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-500" aria-hidden="true" />
              <h3 className="text-base font-bold font-outfit text-foreground">
                Status Conversion Funnel ({periodLabel})
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Application progression across pipeline stages for {periodLabel}.
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
        <AnimatedContainer delay={420} className="lg:col-span-2">
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

              {/* Journal Month Selector */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <label htmlFor="journal-month-selector" className="sr-only">Select reflection month</label>
                <input
                  id="journal-month-selector"
                  type="month"
                  value={journalMonth}
                  onChange={(e) => handleJournalMonthSelect(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-card border border-input text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
                />
              </div>
            </div>

            {/* If reflection exists and user is NOT editing -> Show formatted text with Edit Reflection button */}
            {currentSavedContent && !isEditing ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-card/80 border border-border text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans shadow-inner">
                  {currentSavedContent}
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReflectionText(currentSavedContent);
                      setIsEditing(true);
                    }}
                    leftIcon={<Edit3 className="w-4 h-4" />}
                  >
                    Edit Reflection
                  </Button>
                </div>
              </div>
            ) : (
              /* Edit Mode / Textarea input view */
              <div className="space-y-4">
                <label htmlFor="reflection-textarea" className="sr-only">
                  Reflection notes for {journalMonth}
                </label>
                <textarea
                  id="reflection-textarea"
                  rows={7}
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder={`Reflect on your career & application progress for ${journalMonth}... (e.g. What went well this month? What can be improved?)`}
                  className="w-full p-4 rounded-2xl bg-card border border-input text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
                />

                <div className="flex justify-end space-x-3">
                  {currentSavedContent && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setReflectionText(currentSavedContent);
                        setIsEditing(false);
                      }}
                      leftIcon={<X className="w-4 h-4" />}
                    >
                      Cancel
                    </Button>
                  )}

                  <Button
                    variant="primary"
                    onClick={handleSaveReflection}
                    isLoading={isSaving}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Reflection ({journalMonth})
                  </Button>
                </div>
              </div>
            )}
          </div>
        </AnimatedContainer>

        {/* Recent Activity Feed (1 Col) */}
        <AnimatedContainer delay={460}>
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

