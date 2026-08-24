import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReflectionView } from "@/components/modules/reflection/reflection-view";
import { PageHeader } from "@/components/ui/page-header";
import { STATUS_LABELS } from "@/lib/constants";
import { Opportunity, ActivityLog } from "@/domain/opportunity.types";
import Link from "next/link";
import { Calendar, CalendarDays } from "lucide-react";

interface ReflectionPageProps {
  searchParams: Promise<{
    view?: string;
    month?: string;
    year?: string;
  }>;
}

export default async function ReflectionPage({ searchParams }: ReflectionPageProps) {
  const params = await searchParams;
  const now = new Date();
  const defaultMonth = now.toISOString().slice(0, 7); // "YYYY-MM"
  const defaultYear = String(now.getFullYear()); // "YYYY"

  const currentView = (params.view === "yearly" ? "yearly" : "monthly") as "monthly" | "yearly";
  const selectedMonth = params.month || defaultMonth;
  const selectedYear = params.year || defaultYear;

  const session = await auth();
  const userId = session?.user?.id || "";

  // Fetch all user opportunities
  const opportunities = (await prisma.opportunity.findMany({
    where: { userId },
  })) as unknown as Opportunity[];

  // Helper date matchers
  const getMonthKey = (d: Date | string) => new Date(d).toISOString().slice(0, 7);
  const getYearKey = (d: Date | string) => String(new Date(d).getFullYear());

  // Filter opportunities scoped to current selection
  const scopedOpps = opportunities.filter((opp: Opportunity) => {
    if (currentView === "yearly") {
      return getYearKey(opp.createdAt) === selectedYear || getYearKey(opp.updatedAt) === selectedYear;
    } else {
      return getMonthKey(opp.createdAt) === selectedMonth || getMonthKey(opp.updatedAt) === selectedMonth;
    }
  });

  // Calculate Category breakdown for scoped view
  const categoryCounts: Record<string, number> = {};
  scopedOpps.forEach((opp: Opportunity) => {
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

  // Calculate Status Conversion counts using centralized labels for scoped view
  const statusCounts: Record<string, number> = {};
  Object.values(STATUS_LABELS).forEach((label) => {
    statusCounts[label] = 0;
  });

  scopedOpps.forEach((opp: Opportunity) => {
    const label = STATUS_LABELS[opp.status] || "Not Started";
    statusCounts[label] = (statusCounts[label] || 0) + 1;
  });

  const statusData = Object.entries(statusCounts).map(([st, count]) => ({
    status: st,
    count,
  }));

  // Calculate Acceptance Rate for scoped view
  const totalSubmittedOrDecided =
    statusCounts["Submitted"] + statusCounts["Interview"] + statusCounts["Accepted"] + statusCounts["Rejected"];
  const acceptedCount = statusCounts["Accepted"];
  const acceptanceRate =
    totalSubmittedOrDecided > 0
      ? `${Math.round((acceptedCount / totalSubmittedOrDecided) * 100)}%`
      : "N/A";

  // Calculate Velocity Data
  const velocityData: { period: string; total: number; submitted: number }[] = [];

  if (currentView === "yearly") {
    // Yearly view: show all 12 individual months (Jan - Dec) for the selected year
    const targetYearNum = parseInt(selectedYear, 10);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    months.forEach((monthName, idx) => {
      const monthStr = String(idx + 1).padStart(2, "0");
      const monthKey = `${targetYearNum}-${monthStr}`;

      const totalCreated = opportunities.filter((opp: Opportunity) => getMonthKey(opp.createdAt) === monthKey).length;
      const totalSubmitted = opportunities.filter((opp: Opportunity) => {
        return getMonthKey(opp.updatedAt) === monthKey && (opp.status === "SUBMITTED" || opp.status === "ACCEPTED" || opp.status === "INTERVIEW" || opp.status === "REJECTED");
      }).length;

      velocityData.push({
        period: monthName,
        total: totalCreated,
        submitted: totalSubmitted,
      });
    });
  } else {
    // Monthly view: past 6 months leading up to selected month
    const [yNum, mNum] = selectedMonth.split("-").map((n) => parseInt(n, 10));
    const baseDate = new Date(yNum, mNum - 1, 1);

    for (let i = 5; i >= 0; i--) {
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
      const monthKey = d.toISOString().slice(0, 7);
      const monthLabel = d.toLocaleString("default", { month: "short", year: "2-digit" });

      const totalCreatedInMonth = opportunities.filter((opp: Opportunity) => getMonthKey(opp.createdAt) === monthKey).length;
      const totalSubmittedInMonth = opportunities.filter((opp: Opportunity) => {
        return getMonthKey(opp.updatedAt) === monthKey && (opp.status === "SUBMITTED" || opp.status === "ACCEPTED" || opp.status === "INTERVIEW" || opp.status === "REJECTED");
      }).length;

      velocityData.push({
        period: monthLabel,
        total: totalCreatedInMonth,
        submitted: totalSubmittedInMonth,
      });
    }
  }

  // Count submitted applications in the selected period
  const submittedInPeriod = scopedOpps.filter(
    (opp: Opportunity) => opp.status === "SUBMITTED" || opp.status === "ACCEPTED" || opp.status === "INTERVIEW" || opp.status === "REJECTED"
  ).length;

  // Available years for dropdown selection (past 5 years + current year)
  const currentYearNum = now.getFullYear();
  const availableYears = Array.from({ length: 6 }, (_, i) => String(currentYearNum - i));

  // Fetch monthly reflections
  const reflections = await prisma.monthlyReflection.findMany({
    where: { userId },
  });

  const reflectionsMap: Record<string, { id: string; monthYear: string; content: string }> = {};
  reflections.forEach((ref: { id: string; monthYear: string; content: string }) => {
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

  // Display label for selected period
  const periodLabel =
    currentView === "yearly"
      ? selectedYear
      : new Date(selectedMonth + "-01").toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <ReflectionView
      velocityData={velocityData}
      categoryData={categoryData}
      statusData={statusData}
      recentActivities={recentActivities as unknown as ActivityLog[]}
      reflectionsMap={reflectionsMap}
      currentView={currentView}
      selectedMonth={selectedMonth}
      selectedYear={selectedYear}
      availableYears={availableYears}
      periodLabel={periodLabel}
      stats={{
        totalApplications: scopedOpps.length,
        submittedThisMonth: submittedInPeriod,
        acceptedCount,
        acceptanceRate,
        topCategory: topCat,
      }}
    />
  );
}


