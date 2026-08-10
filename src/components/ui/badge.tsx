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

export function InteractiveStatusBadge({
  status,
  onStatusChange,
}: {
  status: OpportunityStatus;
  onStatusChange: (newStatus: OpportunityStatus) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusOptions: { value: OpportunityStatus; label: string; style: string }[] = [
    { value: "NOT_STARTED", label: "Not Started", style: "bg-secondary text-muted-foreground border-border" },
    { value: "IN_PROGRESS", label: "In Progress", style: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
    { value: "SUBMITTED", label: "Submitted", style: "bg-primary/10 text-primary border-primary/20" },
    { value: "INTERVIEW", label: "Interview", style: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    { value: "ACCEPTED", label: "Accepted", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { value: "REJECTED", label: "Rejected", style: "bg-destructive/10 text-destructive border-destructive/20" },
  ];

  const currentOption = statusOptions.find((opt) => opt.value === status) || statusOptions[0];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border tracking-wide transition-all cursor-pointer hover:opacity-85 shadow-xs",
          currentOption.style
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{currentOption.label}</span>
        <svg
          className={cn("w-3 h-3 transition-transform duration-200", isOpen && "rotate-180")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 z-50 w-44 rounded-2xl bg-card border border-border shadow-2xl p-1.5 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/60 mb-1">
            Update Status
          </div>
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onStatusChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between text-left font-semibold transition-all cursor-pointer",
                opt.value === status
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-secondary text-foreground"
              )}
            >
              <span className={cn("px-2 py-0.5 rounded-md text-[11px] border", opt.style)}>
                {opt.label}
              </span>
              {opt.value === status && <span className="text-primary text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function InteractivePriorityBadge({
  priority,
  onPriorityChange,
}: {
  priority: OpportunityPriority;
  onPriorityChange: (newPriority: OpportunityPriority) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const priorityOptions: { value: OpportunityPriority; label: string; style: string }[] = [
    { value: "HIGH", label: "High Priority", style: "bg-destructive/10 text-destructive border-destructive/20" },
    { value: "MEDIUM", label: "Medium Priority", style: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    { value: "LOW", label: "Low Priority", style: "bg-secondary text-muted-foreground border-border" },
  ];

  const currentOption = priorityOptions.find((opt) => opt.value === priority) || priorityOptions[1];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border tracking-wide transition-all cursor-pointer hover:opacity-85 shadow-xs",
          currentOption.style
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{currentOption.label}</span>
        <svg
          className={cn("w-3 h-3 transition-transform duration-200", isOpen && "rotate-180")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 z-50 w-40 rounded-2xl bg-card border border-border shadow-2xl p-1.5 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/60 mb-1">
            Set Priority
          </div>
          {priorityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onPriorityChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between text-left font-semibold transition-all cursor-pointer",
                opt.value === priority
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-secondary text-foreground"
              )}
            >
              <span className={cn("px-2 py-0.5 rounded-md text-[11px] border", opt.style)}>
                {opt.label}
              </span>
              {opt.value === priority && <span className="text-primary text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
