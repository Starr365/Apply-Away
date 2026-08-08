"use client";

import { CheckCircle2, X } from "lucide-react";
import { AnimatedContainer } from "@/components/ui/animated-container";

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
        <AnimatedContainer delay={100} className="text-center space-y-3 max-w-xl mx-auto">
          <div className="text-xs font-bold text-purple-650 dark:text-purple-400 uppercase tracking-widest">Modern Workflows</div>
          <h2 className="text-3xl font-bold font-outfit text-foreground">Manual Spreadsheets vs. Apply Away</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Why spreadsheet tracking fails active students and early-career professionals.
          </p>
        </AnimatedContainer>

        <AnimatedContainer delay={200} className="bg-card/45 backdrop-blur-md rounded-2xl overflow-hidden border border-border/80 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs select-none">
              <thead>
                <tr className="border-b border-border/85 bg-slate-900/60 dark:bg-slate-900/30 font-bold text-foreground uppercase tracking-wider">
                  <th className="p-4 text-foreground dark:text-white">Tracking criteria</th>
                  <th className="p-4 border-l border-border/60 text-foreground dark:text-white">Traditional tracking</th>
                  <th className="p-4 border-l border-border/60 text-purple-600 dark:text-purple-300">Apply Away Vault</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ITEMS.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/40 hover:bg-card/25 transition-colors"
                  >
                    <td className="p-4 font-semibold text-foreground">{item.label}</td>
                    <td className="p-4 border-l border-border/60 text-muted-foreground">
                      <span className="inline-flex items-center space-x-1.5">
                        <X className="w-4 h-4 text-rose-500" />
                        <span>{item.without}</span>
                      </span>
                    </td>
                    <td className="p-4 border-l border-border/60 text-foreground">
                      <span className="inline-flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-medium text-foreground">{item.with}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
