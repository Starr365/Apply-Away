"use client";

import { Opportunity, OpportunityStatus, OpportunityPriority } from "@/domain/opportunity.types";
import { CategoryBadge, StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import {
  updateOpportunityStatusAction,
  updateOpportunityPriorityAction,
  deleteOpportunityAction,
} from "@/app/actions/opportunity.actions";
import {
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash2,
  Clock,
  Building,
  FolderOpen,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/toast-provider";
import Link from "next/link";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onEdit: (opp: Opportunity) => void;
}

export function OpportunityCard({ opportunity, onEdit }: OpportunityCardProps) {
  const toast = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deadlineInfo = getDaysRemaining(opportunity.deadline);

  const handleStatusChange = async (status: OpportunityStatus) => {
    setShowMenu(false);
    const res = await updateOpportunityStatusAction(opportunity.id, status);
    if (res.success) {
      toast.success(`Status updated to ${status.replace(/_/g, " ")}`);
    } else {
      toast.error(res.error || "Failed to update status.");
    }
  };

  const handlePriorityChange = async (priority: OpportunityPriority) => {
    setShowMenu(false);
    const res = await updateOpportunityPriorityAction(opportunity.id, priority);
    if (res.success) {
      toast.success(`Priority updated to ${priority}`);
    } else {
      toast.error(res.error || "Failed to update priority.");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${opportunity.title}"?`)) return;
    setIsDeleting(true);
    const res = await deleteOpportunityAction(opportunity.id);
    if (res.success) {
      toast.success("Opportunity deleted.");
    } else {
      toast.error(res.error || "Failed to delete record.");
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all ${
        isDeleting ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      {/* Header: Title, Org & Action Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="flex items-center space-x-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
            <Building className="w-3.5 h-3.5" />
            <span>{opportunity.organization}</span>
          </div>
          {opportunity.officialUrl || opportunity.applicationUrl ? (
            <a
              href={opportunity.officialUrl || opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold font-outfit text-primary hover:underline leading-snug line-clamp-2 inline-flex items-center gap-1 group"
            >
              <span>{opportunity.title}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          ) : (
            <h3 className="text-base font-bold font-outfit text-slate-900 dark:text-white leading-snug line-clamp-2">
              {opportunity.title}
            </h3>
          )}
        </div>

        {/* Dropdown Menu Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 z-30 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl p-1.5 space-y-1 text-xs text-slate-700 dark:text-slate-300">
              <Link
                href={`/opportunities/${opportunity.id}`}
                onClick={() => setShowMenu(false)}
                className="w-full px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 text-left cursor-pointer animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <FolderOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>View Details</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit(opportunity);
                }}
                className="w-full px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 text-left cursor-pointer animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <Pencil className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Edit Opportunity</span>
              </button>

              <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

              <div className="px-3 py-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Change Status
              </div>

              {(["NOT_STARTED", "IN_PROGRESS", "SUBMITTED", "INTERVIEW", "ACCEPTED", "REJECTED"] as OpportunityStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    className={`w-full px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer ${
                      opportunity.status === st ? "text-purple-600 dark:text-purple-400 font-bold" : ""
                    }`}
                  >
                    <span>{st.replace(/_/g, " ")}</span>
                    {opportunity.status === st && <span>✓</span>}
                  </button>
                )
              )}

              <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

              <div className="px-3 py-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Change Priority
              </div>

              {(["HIGH", "MEDIUM", "LOW"] as OpportunityPriority[]).map((pr) => (
                <button
                  key={pr}
                  type="button"
                  onClick={() => handlePriorityChange(pr)}
                  className={`w-full px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer ${
                    opportunity.priority === pr ? "text-amber-600 dark:text-amber-400 font-bold" : ""
                  }`}
                >
                  <span>{pr} Priority</span>
                  {opportunity.priority === pr && <span>✓</span>}
                </button>
              ))}

              <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

              <button
                type="button"
                onClick={handleDelete}
                className="w-full px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center space-x-2 text-left cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description Snippet */}
      {opportunity.shortDescription && (
        <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-2">{opportunity.shortDescription}</p>
      )}

      {/* Badges Row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <CategoryBadge category={opportunity.category} />
        <StatusBadge status={opportunity.status} />
        <PriorityBadge priority={opportunity.priority} />
      </div>

      {/* Footer Meta Details & Link */}
      <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-1.5">
          <Clock
            className={`w-3.5 h-3.5 ${
              deadlineInfo.isOverdue ? "text-rose-600 dark:text-rose-400" : "text-amber-500 dark:text-amber-400"
            }`}
          />
          <span className={deadlineInfo.isOverdue ? "text-rose-600 dark:text-rose-400 font-medium" : ""}>
            {deadlineInfo.label} ({formatDate(opportunity.deadline)})
          </span>
        </div>

        {opportunity.officialUrl && (
          <a
            href={opportunity.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-purple-650 hover:text-purple-750 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
          >
            <span>Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
