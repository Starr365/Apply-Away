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
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import Link from "next/link";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onEdit: (opp: Opportunity) => void;
}

export function OpportunityCard({ opportunity, onEdit }: OpportunityCardProps) {
  const toast = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteOpportunityAction(opportunity.id);
      if (res.success) {
        toast.success("Opportunity deleted.");
        setIsConfirmModalOpen(false);
      } else {
        toast.error(res.error || "Failed to delete record.");
        setIsDeleting(false);
      }
    } catch {
      toast.error("Failed to delete record.");
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
          <div className="flex items-center space-x-2 text-xs text-primary font-medium">
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
            <h3 className="text-base font-bold font-outfit text-foreground leading-snug line-clamp-2">
              {opportunity.title}
            </h3>
          )}
        </div>

        {/* Dropdown Menu Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 z-30 w-48 rounded-xl bg-card border border-border shadow-2xl p-1.5 space-y-1 text-xs text-card-foreground">
              <Link
                href={`/opportunities/${opportunity.id}`}
                onClick={() => setShowMenu(false)}
                className="w-full px-3 py-2 rounded-lg hover:bg-secondary flex items-center space-x-2 text-left cursor-pointer animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <FolderOpen className="w-3.5 h-3.5 text-primary" />
                <span>View Details</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit(opportunity);
                }}
                className="w-full px-3 py-2 rounded-lg hover:bg-secondary flex items-center space-x-2 text-left cursor-pointer animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <Pencil className="w-3.5 h-3.5 text-primary" />
                <span>Edit Opportunity</span>
              </button>

              <div className="hidden sm:block">
                <div className="border-t border-border my-1" />

                <div className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase">
                  Change Status
                </div>

                {(["NOT_STARTED", "IN_PROGRESS", "SUBMITTED", "INTERVIEW", "ACCEPTED", "REJECTED"] as OpportunityStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`w-full px-3 py-1.5 rounded-lg hover:bg-secondary flex items-center justify-between cursor-pointer ${
                        opportunity.status === st ? "text-primary font-bold" : ""
                      }`}
                    >
                      <span>{st.replace(/_/g, " ")}</span>
                      {opportunity.status === st && <span>✓</span>}
                    </button>
                  )
                )}

                <div className="border-t border-border my-1" />

                <div className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase">
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
              </div>

              <div className="border-t border-border my-1" />

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  setIsConfirmModalOpen(true);
                }}
                className="w-full px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive flex items-center space-x-2 text-left cursor-pointer"
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
        <p className="text-xs text-muted-foreground line-clamp-2">{opportunity.shortDescription}</p>
      )}

      {/* Personal Notes Section */}
      {opportunity.personalNotes && opportunity.personalNotes.trim() !== "" && (
        <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-[11px] leading-relaxed text-slate-400 italic">
          <strong className="text-[10px] font-bold text-muted-foreground uppercase not-italic block mb-0.5">Notes:</strong>
          <p className="line-clamp-2">{opportunity.personalNotes}</p>
        </div>
      )}

      {/* Badges Row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <CategoryBadge category={opportunity.category} />
        <StatusBadge status={opportunity.status} />
        <PriorityBadge priority={opportunity.priority} />
      </div>

      {/* Footer Meta Details & Link */}
      <div className="border-t border-border pt-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-1.5">
          <Clock
            className={`w-3.5 h-3.5 ${
              deadlineInfo.isOverdue ? "text-muted-foreground/70" : "text-amber-500"
            }`}
          />
          <span className={deadlineInfo.isOverdue ? "text-muted-foreground font-normal" : "text-foreground font-medium"}>
            {deadlineInfo.label} ({formatDate(opportunity.deadline)})
          </span>
        </div>

        {opportunity.officialUrl && (
          <a
            href={opportunity.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
          >
            <span>Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          if (!isDeleting) setIsConfirmModalOpen(false);
        }}
        onConfirm={confirmDelete}
        title="Delete Opportunity"
        description={`Are you sure you want to delete "${opportunity.title}"? This will permanently remove this opportunity and its associated notes and essay drafts.`}
        confirmText="Delete Record"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
