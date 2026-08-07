"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveMonthlyReflectionAction } from "@/app/actions/reflection.actions";
import { ApplicationVelocityChart } from "./charts/application-velocity-chart";
import { CategoryPieChart } from "./charts/category-pie-chart";
import { StatusConversionChart } from "./charts/status-conversion-chart";
import { ActivityLog } from "@/domain/opportunity.types";
import {
  TrendingUp,
  Award,
  BookOpen,
  History,
  Save,
  CheckCircle2,
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
  const currentMonthYear = new Date().toISOString().slice(0, 7); // e.g. "2026-08"
  const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);
  const [reflectionText, setReflectionText] = useState(
    reflectionsMap[currentMonthYear]?.content || ""
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setReflectionText(reflectionsMap[month]?.content || "");
  };

  const handleSaveReflection = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await saveMonthlyReflectionAction(selectedMonth, reflectionText);
      if (res.success) {
        toast.success(`Reflection notes saved for ${selectedMonth}!`);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
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
        <div className="glass-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Vault</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-outfit text-white">{stats.totalApplications}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Submitted (This Month)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-outfit text-emerald-400">
            {stats.submittedThisMonth}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Acceptance Rate</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-outfit text-amber-400">
            {stats.acceptanceRate}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Top Category</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-lg font-bold font-outfit text-sky-400 truncate">
            {stats.topCategory}
          </div>
        </div>
      </div>

      {/* Responsive Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Application Velocity Over Time */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold font-outfit text-white">Application Velocity</h3>
          </div>
          <p className="text-xs text-slate-400">
            Monthly trend of new opportunities created vs. submitted applications over time.
          </p>
          <ApplicationVelocityChart data={velocityData} />
        </div>

        {/* Chart 2: Category Breakdown */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2">
            <PieIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold font-outfit text-white">Category Distribution</h3>
          </div>
          <p className="text-xs text-slate-400">
            Breakdown of your opportunities across fellowships, grants, scholarships, and jobs.
          </p>
          <CategoryPieChart data={categoryData} />
        </div>

        {/* Chart 3: Pipeline Status Conversion */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 lg:col-span-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold font-outfit text-white">Status Conversion Funnel</h3>
          </div>
          <p className="text-xs text-slate-400">
            Application progression across pipeline stages (Not Started → In Progress → Submitted → Interview → Accepted).
          </p>
          <StatusConversionChart data={statusData} />
        </div>
      </div>

      {/* Grid: Monthly Reflection Journal & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Reflection Notes Journal (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Monthly Reflection Journal</span>
              </div>
              <p className="text-xs text-slate-400">
                Log monthly insights, key learnings, networking notes, and goals for future applications.
              </p>
            </div>

            {/* Month Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => handleMonthSelect(e.target.value)}
                className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
              />
            </div>
          </div>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              Reflection notes for {selectedMonth} saved successfully!
            </div>
          )}

          <textarea
            rows={7}
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder={`Reflect on your career & application progress for ${selectedMonth}... (e.g. What went well this month? What can be improved?)`}
            className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveReflection}
              disabled={isSaving}
              className="h-11 px-6 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-600/20 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : `Save Reflection (${selectedMonth})`}</span>
            </button>
          </div>
        </div>

        {/* Recent Activity Feed (1 Col) */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <History className="w-4 h-4 text-purple-400" />
            <span>Recent Audit Feed</span>
          </div>

          {recentActivities.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No recent activity recorded.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {recentActivities.map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-purple-300">
                    {act.action.replace(/_/g, " ")}
                  </div>
                  <div className="text-slate-400 line-clamp-2">{act.description}</div>
                  <div className="text-[10px] text-slate-500">
                    {new Date(act.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
