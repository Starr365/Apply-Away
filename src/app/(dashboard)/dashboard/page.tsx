import { auth } from "@/lib/auth";
import { PrismaOpportunityRepository } from "@/repositories/prisma-opportunity.repository";
import { DashboardView } from "@/components/modules/dashboard/dashboard-view";
import { OpportunityCategory, OpportunityStatus } from "@/domain/opportunity.types";
import { prisma } from "@/lib/prisma";

const repository = new PrismaOpportunityRepository();

interface DashboardPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: string;
    dueSoon?: string;
    missed?: string;
    page?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();
  const userId = session?.user?.id || "";

  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const limit = 10;

  const now = new Date();
  const isDueSoon = params.dueSoon === "true";
  const isMissed = params.missed === "true";

  // If missed=true, fetch opportunities with past deadlines that were never submitted
  let opportunities: Awaited<ReturnType<typeof repository.findAll>>["items"];
  let total: number;

  if (isMissed) {
    const skip = (page - 1) * limit;
    const missedWhere = {
      userId,
      status: { in: ["NOT_STARTED" as const, "IN_PROGRESS" as const] },
      deadline: { lt: now },
    };
    const [items, count] = await Promise.all([
      prisma.opportunity.findMany({
        where: missedWhere,
        orderBy: { deadline: "desc" },
        skip,
        take: limit,
        include: { essayQuestions: true },
      }),
      prisma.opportunity.count({ where: missedWhere }),
    ]);
    opportunities = items as unknown as typeof opportunities;
    total = count;
  } else {
    const result = await repository.findAll({
      userId,
      category: params.category as OpportunityCategory,
      status: params.status as OpportunityStatus,
      search: params.search,
      sortBy: isDueSoon ? "deadline" : ((params.sortBy as "deadline" | "createdAt" | "priority" | "title") || "createdAt"),
      sortOrder: isDueSoon ? "asc" : ((params.sortOrder as "asc" | "desc") || "desc"),
      page,
      limit,
    });
    opportunities = result.items;
    total = result.total;
  }

  // Calculate summary metrics for dashboard cards
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [totalCount, missedDeadlinesCount, submittedCount, dueSoonCount] = await Promise.all([
    prisma.opportunity.count({ where: { userId } }),
    prisma.opportunity.count({
      where: {
        userId,
        status: { in: ["NOT_STARTED", "IN_PROGRESS"] },
        deadline: { lt: now },
      },
    }),
    prisma.opportunity.count({ where: { userId, status: "SUBMITTED" } }),
    prisma.opportunity.count({
      where: {
        userId,
        deadline: {
          gte: now,
          lte: sevenDaysFromNow,
        },
      },
    }),
  ]);

  return (
    <DashboardView
      opportunities={opportunities}
      total={total}
      currentPage={page}
      limit={limit}
      stats={{
        total: totalCount,
        missedDeadlines: missedDeadlinesCount,
        submitted: submittedCount,
        dueSoon: dueSoonCount,
      }}
    />
  );
}


