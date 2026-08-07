import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyStateInner({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description = "Get started by adding your first item.",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center space-y-4",
        className
      )}
      role="status"
      aria-label={title}
    >
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
        <Icon className="w-8 h-8" aria-hidden="true" />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-lg font-bold font-outfit text-white">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

export const EmptyState = React.memo(EmptyStateInner);
