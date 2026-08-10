"use client";

import { DateRangeKey } from "@/services/admin-analytics.service";
import { Calendar } from "lucide-react";

interface DateRangePickerProps {
  currentRange: DateRangeKey;
  onChangeRange: (key: DateRangeKey) => void;
}

export function DateRangePicker({ currentRange, onChangeRange }: DateRangePickerProps) {
  const options: { key: DateRangeKey; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "7d", label: "Last 7 Days" },
    { key: "30d", label: "Last 30 Days" },
    { key: "90d", label: "Last 90 Days" },
  ];

  return (
    <div className="flex items-center space-x-1.5 bg-card border border-border p-1 rounded-2xl shadow-xs">
      <div className="flex items-center space-x-1 px-3 py-1 text-xs text-muted-foreground font-semibold">
        <Calendar className="w-3.5 h-3.5 text-primary" />
        <span className="hidden sm:inline">Range:</span>
      </div>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChangeRange(opt.key)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            currentRange === opt.key
              ? "bg-primary text-slate-950 shadow-md shadow-primary/20 scale-[1.02]"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
