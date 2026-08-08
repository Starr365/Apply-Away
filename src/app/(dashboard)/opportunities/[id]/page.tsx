import { auth } from "@/lib/auth";
import { PrismaOpportunityRepository } from "@/repositories/prisma-opportunity.repository";
import { OpportunityDetailView } from "@/components/modules/details/opportunity-detail-view";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { ActivityLog } from "@/domain/opportunity.types";

const repository = new PrismaOpportunityRepository();

interface OpportunityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const session = await auth();
  const userId = session?.user?.id || "";

  const { id } = await params;

  const opportunity = await repository.findById(id, userId);

  if (!opportunity) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="Opportunity Not Found"
        description="The opportunity record you are trying to access does not exist or you do not have permission to view it."
        action={
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-all shadow-md shadow-purple-600/20"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Return to Vault Dashboard</span>
          </Link>
        }
      />
    );
  }

  // Fetch activity logs for this opportunity
  const logs = await prisma.activityLog.findMany({
    where: { opportunityId: id, userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <OpportunityDetailView
      opportunity={opportunity}
      activityLogs={logs as unknown as ActivityLog[]}
    />
  );
}

