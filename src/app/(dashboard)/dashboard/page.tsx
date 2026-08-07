import { auth } from "@/lib/auth";
import { PrismaOpportunityRepository } from "@/repositories/prisma-opportunity.repository";
import { DashboardView } from "@/components/modules/dashboard/dashboard-view";
import { OpportunityCategory, OpportunityStatus } from "@/domain/opportunity.types";
import Link from "next/link";
import { Sparkles, User } from "lucide-react";
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

  if (!userId) {
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Apply Away &copy; {new Date().getFullYear()} – Multi-Tenant Opportunity Vault
        </div>
      </footer>
    </div>
  );
}
