"use client";

import { History } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface RecentActivityFeedProps {
  activity: {
    id: string;
    event: string;
    timestamp: Date | string;
    source: string;
  }[];
}

export function RecentActivityFeed({ activity }: RecentActivityFeedProps) {
  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-border/80 shadow-md space-y-4">
      <div className="flex items-center space-x-2 border-b border-border pb-3">
        <History className="w-4 h-4 text-primary" />
        <div>
          <h3 className="text-base font-bold font-outfit text-foreground">Recent Activity Stream</h3>
          <p className="text-xs text-muted-foreground">Privacy-safe event stream of incoming user actions.</p>
        </div>
      </div>

      {activity.length === 0 ? (
        <div className="py-6 text-center text-xs text-muted-foreground">
          No recent activity logs recorded yet.
        </div>
      ) : (
        <div className="space-y-2">
          {activity.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 hover:bg-secondary/40 transition-colors text-xs"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-bold text-foreground">{item.event}</span>
                <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md">
                  {item.source}
                </span>
              </div>
              <span className="text-muted-foreground font-mono text-[11px]">
                {formatDate(item.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
