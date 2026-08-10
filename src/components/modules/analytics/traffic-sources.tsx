"use client";

import { Share2 } from "lucide-react";

interface TrafficSourcesProps {
  sources: {
    source: string;
    visitors: number;
    signups: number;
    conversionRate: number;
  }[];
}

export function TrafficSources({ sources }: TrafficSourcesProps) {
  const totalVisitors = sources.reduce((acc, curr) => acc + curr.visitors, 0);

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-border/80 shadow-md space-y-4">
      <div className="flex items-center space-x-2 border-b border-border pb-3">
        <Share2 className="w-4 h-4 text-primary" />
        <div>
          <h3 className="text-base font-bold font-outfit text-foreground">Where are people coming from?</h3>
          <p className="text-xs text-muted-foreground">Acquisition channels driving traffic and sign-ups.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-[11px] uppercase tracking-wider">
              <th className="pb-2 font-bold">Source Channel</th>
              <th className="pb-2 font-bold text-right">Visitors</th>
              <th className="pb-2 font-bold text-right">Sign-ups</th>
              <th className="pb-2 font-bold text-right">Conv. Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sources.map((item) => {
              const sharePct = totalVisitors > 0 ? Math.round((item.visitors / totalVisitors) * 100) : 0;

              return (
                <tr key={item.source} className="hover:bg-secondary/40 transition-colors">
                  <td className="py-2.5 font-bold text-foreground">
                    <div className="flex items-center space-x-2">
                      <span>{item.source}</span>
                      <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md">
                        {sharePct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right text-foreground font-semibold">
                    {item.visitors.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right text-primary font-bold">
                    {item.signups.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-extrabold text-emerald-500">
                    {item.conversionRate}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
