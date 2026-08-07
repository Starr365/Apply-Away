import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReflectionView } from "@/components/modules/reflection/reflection-view";
import Link from "next/link";
import { Sparkles, ArrowLeft, User } from "lucide-react";
import { OpportunityStatus, ActivityLog } from "@/domain/opportunity.types";

export default async function ReflectionPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null; // Handled by middleware
  }

  // Fetch all user opportunities for metrics calculations
  const opportunities = await prisma.opportunity.findMany({
    where: { userId },
  });

  // Calculate Category breakdown
  const categoryCounts: Record<string, number> = {};
  opportunities.forEach((opp) => {
    const cat = opp.category || "OTHER";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCounts).map(([cat, val]) => ({
    name: cat.charAt(0) + cat.slice(1).toLowerCase(),
    value: val,
  }));

  // Find top category
  let topCat = "N/A";
  let maxCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCat = cat.charAt(0) + cat.slice(1).toLowerCase();
    }
  });

  // Calculate Status Conversion counts
  const statusLabels: Record<OpportunityStatus, string> = {
    NOT_STARTED: "Not Started",
    IN_PROGRESS: "In Progress",
    SUBMITTED: "Submitted",
    INTERVIEW: "Interview",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
  };

  const statusCounts: Record<string, number> = {
    "Not Started": 0,
    "In Progress": 0,
    Submitted: 0,
    Interview: 0,
    Accepted: 0,
    Rejected: 0,
  };

  opportunities.forEach((opp) => {
    const label = statusLabels[opp.status] || "Not Started";
    statusCounts[label] = (statusCounts[label] || 0) + 1;
  });

  const statusData = Object.entries(statusCounts).map(([st, count]) => ({
    status: st,
    count,
  }));

  // Calculate Acceptance Rate
  const totalSubmittedOrDecided =
    statusCounts["Submitted"] + statusCounts["Interview"] + statusCounts["Accepted"] + statusCounts["Rejected"];
  const acceptedCount = statusCounts["Accepted"];
  const acceptanceRate =
    totalSubmittedOrDecided > 0
      ? `${Math.round((acceptedCount / totalSubmittedOrDecided) * 100)}%`
      : "N/A";

  // Calculate Velocity Data over past 6 months
  const now = new Date();
  const velocityData: { month: string; total: number; submitted: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = d.toISOString().slice(0, 7); // e.g. "2026-08"
    const monthLabel = d.toLocaleString("default", { month: "short", year: "2-digit" });

    const totalCreatedInMonth = opportunities.filter((opp) => {
      const createdKey = new Date(opp.createdAt).toISOString().slice(0, 7);
      return createdKey === monthKey;
    }).length;

    const totalSubmittedInMonth = opportunities.filter((opp) => {
      const updatedKey = new Date(opp.updatedAt).toISOString().slice(0, 7);
      return updatedKey === monthKey && (opp.status === "SUBMITTED" || opp.status === "ACCEPTED");
    }).length;

    velocityData.push({
      month: monthLabel,
      total: totalCreatedInMonth,
      submitted: totalSubmittedInMonth,
    });
  }

  // Submitted this month
  const currentMonthKey = now.toISOString().slice(0, 7);
  const submittedThisMonth = opportunities.filter((opp) => {
    const updatedKey = new Date(opp.updatedAt).toISOString().slice(0, 7);
    return updatedKey === currentMonthKey && (opp.status === "SUBMITTED" || opp.status === "ACCEPTED");
  }).length;

  // Fetch monthly reflections
  const reflections = await prisma.monthlyReflection.findMany({
    where: { userId },
  });

  const reflectionsMap: Record<string, { id: string; monthYear: string; content: string }> = {};
  reflections.forEach((ref) => {
    reflectionsMap[ref.monthYear] = {
      id: ref.id,
      monthYear: ref.monthYear,
      content: ref.content,
    };
  });

  // Fetch recent activity logs
  const recentActivities = await prisma.activityLog.findMany({
    where: { userId },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-outfit font-bold text-xl tracking-tight text-white">
              Apply Away
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-purple-400" />
              <span>Vault Dashboard</span>
            </Link>

            <Link
              href="/profile"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>{session.user.name || "Profile"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
            Reflection & Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track application velocity, category distribution, pipeline conversions, and monthly journal notes.
          </p>
        </div>

        <ReflectionView
          velocityData={velocityData}
          categoryData={categoryData}
          statusData={statusData}
          recentActivities={recentActivities as unknown as ActivityLog[]}
          reflectionsMap={reflectionsMap}
          stats={{
            totalApplications: opportunities.length,
            submittedThisMonth,
            acceptanceRate,
            topCategory: topCat,
          }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Apply Away &copy; {new Date().getFullYear()} – Reflection & Analytics
        </div>
      </footer>
    </div>
  );
}
