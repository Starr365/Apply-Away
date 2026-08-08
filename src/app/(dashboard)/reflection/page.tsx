import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReflectionView } from "@/components/modules/reflection/reflection-view";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { STATUS_LABELS } from "@/lib/constants";
import { Opportunity, ActivityLog } from "@/domain/opportunity.types";

export default async function ReflectionPage() {
  const session = await auth();
  const userId = session?.user?.id || "";

  // Fetch all user opportunities for metrics calculations
  const opportunities = (await prisma.opportunity.findMany({
    where: { userId },
  })) as unknown as Opportunity[];

  // Calculate Category breakdown
  const categoryCounts: Record<string, number> = {};
  opportunities.forEach((opp: Opportunity) => {
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

  // Calculate Status Conversion counts using centralized labels
  const statusCounts: Record<string, number> = {};
  Object.values(STATUS_LABELS).forEach((label) => {
    statusCounts[label] = 0;
  });

  opportunities.forEach((opp: Opportunity) => {
    const label = STATUS_LABELS[opp.status] || "Not Started";
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

    const totalCreatedInMonth = opportunities.filter((opp: Opportunity) => {
      const createdKey = new Date(opp.createdAt).toISOString().slice(0, 7);
      return createdKey === monthKey;
    }).length;

    const totalSubmittedInMonth = opportunities.filter((opp: Opportunity) => {
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
  const submittedThisMonth = opportunities.filter((opp: Opportunity) => {
    const updatedKey = new Date(opp.updatedAt).toISOString().slice(0, 7);
    return updatedKey === currentMonthKey && (opp.status === "SUBMITTED" || opp.status === "ACCEPTED");
  }).length;

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

  return (
    <DashboardLayout session={session} showBackButton footerLabel="Reflection & Analytics">
      <div className="space-y-6">
        <PageHeader
          title="Reflection & Analytics Dashboard"
          description="Track application velocity, category distribution, pipeline conversions, and monthly journal notes."
        />

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
      </div>
    </DashboardLayout>
  );
}
