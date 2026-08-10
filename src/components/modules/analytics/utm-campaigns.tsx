"use client";

import { Target } from "lucide-react";

interface UtmCampaignsProps {
  campaigns: {
    campaign: string;
    source: string;
    visitors: number;
    signups: number;
    activationRate: number;
  }[];
}

export function UtmCampaigns({ campaigns }: UtmCampaignsProps) {
  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-border/80 shadow-md space-y-4">
      <div className="flex items-center space-x-2 border-b border-border pb-3">
        <Target className="w-4 h-4 text-amber-500" />
        <div>
          <h3 className="text-base font-bold font-outfit text-foreground">UTM Campaign Performance</h3>
          <p className="text-xs text-muted-foreground">Which marketing efforts bring users who actually use Apply Away.</p>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="py-6 text-center text-xs text-muted-foreground">
          No UTM campaign data detected for this date range. Share campaign links with <code className="text-primary font-mono">?utm_campaign=...</code> to track campaign performance.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-[11px] uppercase tracking-wider">
                <th className="pb-2 font-bold">Campaign</th>
                <th className="pb-2 font-bold">Source</th>
                <th className="pb-2 font-bold text-right">Visitors</th>
                <th className="pb-2 font-bold text-right">Sign-ups</th>
                <th className="pb-2 font-bold text-right">Activation Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {campaigns.map((c) => (
                <tr key={`${c.campaign}-${c.source}`} className="hover:bg-secondary/40 transition-colors">
                  <td className="py-2.5 font-bold text-foreground">{c.campaign}</td>
                  <td className="py-2.5 text-muted-foreground">{c.source}</td>
                  <td className="py-2.5 text-right text-foreground font-semibold">{c.visitors}</td>
                  <td className="py-2.5 text-right text-primary font-bold">{c.signups}</td>
                  <td className="py-2.5 text-right text-emerald-500 font-bold">{c.activationRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
