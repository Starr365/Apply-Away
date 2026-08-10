"use client";

import { Activity } from "lucide-react";

interface ProductUsageProps {
  usage: {
    event: string;
    count: number;
  }[];
}

export function ProductUsage({ usage }: ProductUsageProps) {
  const maxCount = Math.max(...usage.map((u) => u.count), 1);

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-border/80 shadow-md space-y-4">
      <div className="flex items-center space-x-2 border-b border-border pb-3">
        <Activity className="w-4 h-4 text-purple-400" />
        <div>
          <h3 className="text-base font-bold font-outfit text-foreground">Core Product Usage</h3>
          <p className="text-xs text-muted-foreground">Which meaningful features are users actually taking action on?</p>
        </div>
      </div>

      <div className="space-y-3">
        {usage.map((item) => {
          const pct = Math.round((item.count / maxCount) * 100);

          return (
            <div key={item.event} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-foreground">
                <span>{item.event}</span>
                <span className="font-extrabold text-primary">{item.count.toLocaleString()}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-secondary/80 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-primary to-sky-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
