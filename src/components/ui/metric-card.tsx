import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColorClass?: string;
  valueColorClass?: string;
  className?: string;
}

function MetricCardInner({
  label,
  value,
  icon: Icon,
  iconColorClass = "text-purple-400",
  valueColorClass = "text-white",
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn("glass-card p-4 sm:p-5 rounded-2xl space-y-1", className)}
      role="status"
      aria-label={`${label}: ${value}`}
    >
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <Icon className={cn("w-4 h-4", iconColorClass)} aria-hidden="true" />
      </div>
      <div className={cn("text-2xl font-bold font-outfit", valueColorClass)}>
        {value}
      </div>
    </div>
  );
}

export const MetricCard = React.memo(MetricCardInner);
