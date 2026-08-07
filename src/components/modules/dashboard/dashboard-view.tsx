"use client";

import { useState } from "react";
import { Opportunity } from "@/domain/opportunity.types";
import { OpportunityFilters } from "./opportunity-filters";
import { OpportunityTable } from "./opportunity-table";
import { OpportunityPagination } from "./opportunity-pagination";
import { OpportunityFormModal } from "@/components/modules/opportunity/opportunity-form-modal";
import { AICaptureModal } from "@/components/modules/capture/ai-capture-modal";
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
            Opportunity Vault
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize, track, and manage your career and fellowship applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/calendar"
            className="h-11 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-sm font-semibold inline-flex items-center space-x-2 transition-all"
          >
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Calendar View</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsAICaptureOpen(true)}
            className="h-11 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm font-semibold inline-flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-purple-400" />
            <span>AI Quick Capture</span>
          </button>

          <button
            type="button"
            onClick={handleCreateNew}
            className="h-11 px-5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 inline-flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Opportunity</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Vault</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-outfit text-white">{stats.total}</div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>In Progress</span>
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-outfit text-sky-400">{stats.inProgress}</div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Submitted</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-outfit text-purple-400">{stats.submitted}</div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Due Soon</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-outfit text-amber-400">{stats.dueSoon}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <OpportunityFilters />

      {/* Main Data Table / Mobile Card Grid */}
      <OpportunityTable opportunities={opportunities} onEdit={handleEdit} />

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
      />
    </div>
  );
}
