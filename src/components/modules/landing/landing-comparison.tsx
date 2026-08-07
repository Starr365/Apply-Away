"use client";

import React from "react";
import { CheckCircle2, X } from "lucide-react";

const COMPARE_ITEMS = [
  {
    label: "Automatic Deadline Warnings",
    without: "Manual spreadsheet updates (missed deadlines)",
    with: "Automated timezone cron triggers & email dispatch",
  },
  {
    label: "Opportunity Capture Speed",
    without: "5-10 minutes manual form typing per record",
    with: "Instant AI extraction from URLs / text in 3 seconds",
  },
  {
    label: "Organization & Search",
    without: "Disorganized tabs, lost guidelines, dead URL portals",
    with: "Categorized, searchable, structured vault dashboard",
  },
];

export function LandingComparison() {
  return (
    <section id="compare" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">Modern Workflows</div>
          <h2 className="text-3xl font-bold font-outfit text-white">Manual Spreadsheets vs. Apply Away</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Why spreadsheet tracking fails active students and early-career professionals.
          </p>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-border shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs select-none">
              <thead>
                <tr className="border-b border-border/80 bg-slate-900/60 font-bold text-white uppercase tracking-wider">
                  <th className="p-4">Tracking criteria</th>
                  <th className="p-4 border-l border-border/60">Traditional tracking</th>
                  <th className="p-4 border-l border-border/60 text-purple-300">Apply Away Vault</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ITEMS.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/40 hover:bg-card/25 transition-colors"
                  >
                    <td className="p-4 font-semibold text-white">{item.label}</td>
                    <td className="p-4 border-l border-border/60 text-muted-foreground">
                      <span className="inline-flex items-center space-x-1.5">
                        <X className="w-4 h-4 text-rose-500" />
                        <span>{item.without}</span>
                      </span>
                    </td>
                    <td className="p-4 border-l border-border/60 text-slate-200">
                      <span className="inline-flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="font-medium">{item.with}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
