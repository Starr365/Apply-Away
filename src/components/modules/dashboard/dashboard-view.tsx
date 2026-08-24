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
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle, CheckCircle2, Clock, Layers, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardViewProps {
  opportunities: Opportunity[];
  total: number;
  currentPage: number;
  limit: number;
  stats: {
    total: number;
    missedDeadlines: number;
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

          <Button
            variant="outline"
            onClick={() => setIsAICaptureOpen(true)}
            leftIcon={<Wand2 className="w-4 h-4 text-primary" />}
            aria-label="Open AI quick capture"
          >
            AI Quick Capture
          </Button>

          <Button
            variant="primary"
            onClick={handleCreateNew}
            leftIcon={<Plus className="w-4 h-4" />}
            aria-label="Add new opportunity"
          >
            Add Opportunity
          </Button>
        </PageHeader>
      </AnimatedContainer>

      {/* Summary Metrics Cards (Clickable Filter Triggers) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 select-none">
        <AnimatedContainer delay={60}>
          <Link href="/dashboard" className="block cursor-pointer transition-transform hover:scale-[1.02]" title="Click to show all opportunities">
            <MetricCard label="Total Vault" value={stats.total} icon={Layers} iconColorClass="text-primary" />
          </Link>
        </AnimatedContainer>
        <AnimatedContainer delay={120}>
          <Link href="/dashboard?missed=true" className="block cursor-pointer transition-transform hover:scale-[1.02]" title="Click to filter missed deadline opportunities">
            <MetricCard label="Missed Deadlines" value={stats.missedDeadlines} icon={AlertTriangle} iconColorClass="text-amber-500 dark:text-amber-400" valueColorClass="text-amber-500 dark:text-amber-400" />
          </Link>
        </AnimatedContainer>
        <AnimatedContainer delay={180}>
          <Link href="/dashboard?submitted=true" className="block cursor-pointer transition-transform hover:scale-[1.02]" title="Click to filter Submitted opportunities">
            <MetricCard label="Submitted" value={stats.submitted} icon={CheckCircle2} iconColorClass="text-primary" valueColorClass="text-primary" />
          </Link>
        </AnimatedContainer>
        <AnimatedContainer delay={240}>
          <Link href="/dashboard?dueSoon=true" className="block cursor-pointer transition-transform hover:scale-[1.02]" title="Click to filter Due Soon opportunities">
            <MetricCard label="Due Soon" value={stats.dueSoon} icon={Clock} iconColorClass="text-amber-600 dark:text-amber-400" valueColorClass="text-amber-600 dark:text-amber-400" />
          </Link>
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
