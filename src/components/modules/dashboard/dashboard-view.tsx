"use client";

import { useState } from "react";
import { Opportunity } from "@/domain/opportunity.types";
import { OpportunityFilters } from "./opportunity-filters";
import { OpportunityTable } from "./opportunity-table";
import { OpportunityPagination } from "./opportunity-pagination";
import { OpportunityFormModal } from "@/components/modules/opportunity/opportunity-form-modal";
import { AICaptureModal } from "@/components/modules/capture/ai-capture-modal";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { MetricCard } from "@/components/ui/metric-card";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PageHeader } from "@/components/ui/page-header";
import { Plus, Sparkles, CheckCircle2, Clock, Layers, Wand2, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardViewProps {
  opportunities: Opportunity[];
  total: number;
  currentPage: number;
  limit: number;
  stats: {
    total: number;
    inProgress: number;
    submitted: number;
    dueSoon: number;
  };
}

export function DashboardView({
  opportunities,
  total,
  currentPage,
  limit,
  stats,
}: DashboardViewProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAICaptureOpen, setIsAICaptureOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const handleCreateNew = () => {
    setEditingOpportunity(null);
    setIsModalOpen(true);
  };

  const handleEdit = (opp: Opportunity) => {
    setEditingOpportunity(opp);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Action Header & Greeting */}
      <AnimatedContainer delay={0} direction="fade">
        <PageHeader
          title="Opportunity Vault"
          description="Organize, track, and manage your career and fellowship applications."
        >
          <Link
            href="/calendar"
            className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-semibold inline-flex items-center space-x-2 transition-all"
            aria-label="View deadline calendar"
          >
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            <span>Calendar View</span>
          </Link>

          <Link
            href="/reflection"
            className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-semibold inline-flex items-center space-x-2 transition-all"
            aria-label="View reflection and analytics"
          >
            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Reflection & Analytics</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsAICaptureOpen(true)}
            className="h-11 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-sm font-semibold inline-flex items-center space-x-2 transition-all cursor-pointer"
            aria-label="Open AI quick capture"
          >
            <Wand2 className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            <span>AI Quick Capture</span>
          </button>

          <button
            type="button"
            onClick={handleCreateNew}
            className="h-11 px-5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 inline-flex items-center space-x-2 transition-all cursor-pointer"
            aria-label="Add new opportunity"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add Opportunity</span>
          </button>
        </PageHeader>
      </AnimatedContainer>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <AnimatedContainer delay={60}>
          <MetricCard label="Total Vault" value={stats.total} icon={Layers} iconColorClass="text-purple-650 dark:text-purple-400" />
        </AnimatedContainer>
        <AnimatedContainer delay={120}>
          <MetricCard label="In Progress" value={stats.inProgress} icon={Sparkles} iconColorClass="text-sky-600 dark:text-sky-400" valueColorClass="text-sky-600 dark:text-sky-400" />
        </AnimatedContainer>
        <AnimatedContainer delay={180}>
          <MetricCard label="Submitted" value={stats.submitted} icon={CheckCircle2} iconColorClass="text-purple-605 dark:text-purple-400" valueColorClass="text-purple-605 dark:text-purple-400" />
        </AnimatedContainer>
        <AnimatedContainer delay={240}>
          <MetricCard label="Due Soon" value={stats.dueSoon} icon={Clock} iconColorClass="text-amber-600 dark:text-amber-400" valueColorClass="text-amber-600 dark:text-amber-400" />
        </AnimatedContainer>
      </div>

      {/* Filters Bar */}
      <AnimatedContainer delay={300}>
        <OpportunityFilters />
      </AnimatedContainer>

      {/* Main Data Table / Mobile Card Grid */}
      <AnimatedContainer delay={360}>
        <ErrorBoundary fallbackTitle="Table Error" fallbackDescription="Unable to render the opportunities table.">
          <OpportunityTable opportunities={opportunities} onEdit={handleEdit} />
        </ErrorBoundary>
      </AnimatedContainer>

      {/* Pagination Controls */}
      <OpportunityPagination totalItems={total} currentPage={currentPage} limit={limit} />

      {/* Create / Edit Form Modal */}
      <OpportunityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        opportunityToEdit={editingOpportunity}
      />

      {/* AI Quick Capture Modal */}
      <AICaptureModal
        isOpen={isAICaptureOpen}
        onClose={() => setIsAICaptureOpen(false)}
        onSuccess={() => router.refresh()}
        onFallbackManual={handleCreateNew}
      />
    </div>
  );
}
