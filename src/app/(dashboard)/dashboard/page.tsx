import { auth } from "@/lib/auth";
import { PrismaOpportunityRepository } from "@/repositories/prisma-opportunity.repository";
import { DashboardView } from "@/components/modules/dashboard/dashboard-view";
import { OpportunityCategory, OpportunityStatus } from "@/domain/opportunity.types";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
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
    page?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || !session) {
    return null; // Handled by middleware redirect
  }

  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const limit = 10;

  const { items: opportunities, total } = await repository.findAll({
    userId,
    category: params.category as OpportunityCategory,
    status: params.status as OpportunityStatus,
    search: params.search,
    sortBy: (params.sortBy as "deadline" | "createdAt" | "priority" | "title") || "createdAt",
    sortOrder: (params.sortOrder as "asc" | "desc") || "desc",
    page,
    limit,
  });

  // Calculate summary metrics for dashboard cards
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [totalCount, inProgressCount, submittedCount, dueSoonCount] = await Promise.all([
    prisma.opportunity.count({ where: { userId } }),
    prisma.opportunity.count({ where: { userId, status: "IN_PROGRESS" } }),
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
    <DashboardLayout session={session} footerLabel="Multi-Tenant Opportunity Vault">
      <DashboardView
        opportunities={opportunities}
        total={total}
        currentPage={page}
        limit={limit}
        stats={{
          total: totalCount,
          inProgress: inProgressCount,
          submitted: submittedCount,
          dueSoon: dueSoonCount,
        }}
      />
    </DashboardLayout>
  );
}

