import * as React from "react";
import { cn } from "@/lib/utils";
import {
  OpportunityCategory,
  OpportunityStatus,
  OpportunityPriority,
} from "@/domain/opportunity.types";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants = {
    default: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary text-muted-foreground border border-border",
    outline: "border border-border text-muted-foreground",
    destructive: "bg-destructive/10 text-destructive border border-destructive/20",
  };

  return <div className={cn(baseClasses, variants[variant], className)} {...props} />;
}

export function CategoryBadge({ category }: { category: OpportunityCategory }) {
  const categoryStyles: Record<OpportunityCategory, string> = {
    FELLOWSHIP: "bg-primary/10 text-primary border-primary/20",
    SCHOLARSHIP: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    INTERNSHIP: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    JOB: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    GRANT: "bg-pink-500/10 text-pink-300 border-pink-500/20",
    COMPETITION: "bg-orange-500/10 text-orange-300 border-orange-500/20",
    RESEARCH: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    CONFERENCE: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    BOOTCAMP: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    TRAINING: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    OTHER: "bg-secondary text-muted-foreground border-border",
  };

  const formattedName = category.charAt(0) + category.slice(1).toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide",
        categoryStyles[category] || categoryStyles.OTHER
      )}
    >
      {formattedName}
    </span>
  );
}

export function StatusBadge({ status }: { status: OpportunityStatus }) {
  const statusStyles: Record<OpportunityStatus, { label: string; style: string }> = {
    NOT_STARTED: { label: "Not Started", style: "bg-secondary text-muted-foreground border-border" },
    IN_PROGRESS: { label: "In Progress", style: "bg-sky-500/10 text-sky-300 border-sky-500/20" },
    SUBMITTED: { label: "Submitted", style: "bg-primary/10 text-primary border-primary/20" },
    INTERVIEW: { label: "Interview", style: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
    ACCEPTED: { label: "Accepted", style: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
    REJECTED: { label: "Rejected", style: "bg-destructive/10 text-destructive border-destructive/20" },
  };

  const { label, style } = statusStyles[status] || statusStyles.NOT_STARTED;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide",
        style
      )}
    >
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: OpportunityPriority }) {
  const priorityStyles: Record<OpportunityPriority, { label: string; style: string }> = {
    HIGH: { label: "High", style: "bg-destructive/10 text-destructive border-destructive/20" },
    MEDIUM: { label: "Medium", style: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    LOW: { label: "Low", style: "bg-secondary text-muted-foreground border-border" },
  };

  const { label, style } = priorityStyles[priority] || priorityStyles.MEDIUM;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide",
        style
      )}
    >
      {label}
    </span>
  );
}
