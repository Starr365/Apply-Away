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
import { Plus, Sparkles, CheckCircle2, Clock, Layers, Wand2 } from "lucide-react";
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
            className="h-11 px-4 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground hover:text-foreground text-sm font-semibold inline-flex items-center space-x-2 transition-all"
            aria-label="View deadline calendar"
          >
            <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>Calendar View</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsAICaptureOpen(true)}
            className="h-11 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-sm font-semibold inline-flex items-center space-x-2 transition-all cursor-pointer"
            aria-label="Open AI quick capture"
          >
            <Wand2 className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>AI Quick Capture</span>
          </button>

          <button
            type="button"
            onClick={handleCreateNew}
            className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 inline-flex items-center space-x-2 transition-all cursor-pointer"
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
          <MetricCard label="Total Vault" value={stats.total} icon={Layers} iconColorClass="text-primary" />
        </AnimatedContainer>
        <AnimatedContainer delay={120}>
          <MetricCard label="In Progress" value={stats.inProgress} icon={Sparkles} iconColorClass="text-sky-600 dark:text-sky-400" valueColorClass="text-sky-600 dark:text-sky-400" />
        </AnimatedContainer>
        <AnimatedContainer delay={180}>
          <MetricCard label="Submitted" value={stats.submitted} icon={CheckCircle2} iconColorClass="text-primary" valueColorClass="text-primary" />
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
