import { auth } from "@/lib/auth";
import { PrismaOpportunityRepository } from "@/repositories/prisma-opportunity.repository";
import { OpportunityDetailView } from "@/components/modules/details/opportunity-detail-view";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Sparkles, FolderOpen } from "lucide-react";
import { ActivityLog } from "@/domain/opportunity.types";

const repository = new PrismaOpportunityRepository();

interface OpportunityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null; // Handled by middleware redirect
  }

  const { id } = await params;

  const opportunity = await repository.findById(id, userId);

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
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
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-outfit text-white">Opportunity Not Found</h2>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              The opportunity record you are trying to access does not exist or you do not have permission to view it.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-all shadow-md shadow-purple-600/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Vault Dashboard</span>
          </Link>
        </main>

        <footer className="border-t border-slate-800/60 py-6 bg-slate-950/60 text-center text-xs text-slate-500">
          Apply Away &copy; {new Date().getFullYear()}
        </footer>
      </div>
    );
  }

  // Fetch activity logs for this opportunity
  const logs = await prisma.activityLog.findMany({
    where: { opportunityId: id, userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Navbar Header */}
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
        </div>
      </header>

      {/* Main Detail Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <OpportunityDetailView
          opportunity={opportunity}
          activityLogs={logs as unknown as ActivityLog[]}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Apply Away &copy; {new Date().getFullYear()} – Opportunity Details & Audit History
        </div>
      </footer>
    </div>
  );
}
