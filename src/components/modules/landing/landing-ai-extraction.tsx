"use client";

import React from "react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { ShieldAlert, ExternalLink } from "lucide-react";

export function LandingAIExtraction() {
  return (
    <section className="py-24 bg-card/30 border-t border-border/60 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <AnimatedContainer delay={100} className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            INTELLIGENT STRUCTURING
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-foreground tracking-tight">
            From messy announcement to opportunity in seconds.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            AI extracts the critical details so you can focus on deciding whether to apply.
          </p>
        </AnimatedContainer>

        {/* Realistic Opportunity Record Card */}
        <AnimatedContainer delay={200} className="max-w-3xl mx-auto">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">
                    FELLOWSHIP
                  </span>
                  <span className="text-xs text-muted-foreground">ID: opp_8f92k1</span>
                </div>
                <h3 className="text-xl font-bold font-outfit text-foreground">
                  Mandela Washington Fellowship 2026
                </h3>
                <p className="text-xs text-muted-foreground">
                  U.S. Department of State · Young African Leaders Initiative (YALI)
                </p>
              </div>

              <a
                href="https://yali.state.gov"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
              >
                <span>Official Guidelines Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Extracted Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-foreground">
              <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                <span className="text-muted-foreground font-semibold block text-[11px]">Application Deadline</span>
                <div className="font-bold text-amber-500 text-sm">September 12, 2026 · 11:59 PM WAT</div>
                <span className="text-[10px] text-muted-foreground block">Converted from 5:50 PM EST</span>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                <span className="text-muted-foreground font-semibold block text-[11px]">Eligibility Criteria</span>
                <div className="font-bold text-foreground">Ages 25–35 · Sub-Saharan Africa Citizens</div>
                <span className="text-[10px] text-muted-foreground block">Established record of leadership</span>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border space-y-1 sm:col-span-2">
                <span className="text-muted-foreground font-semibold block text-[11px]">Key Benefits & Coverage</span>
                <div className="text-foreground leading-relaxed">
                  Full 6-week Executive Leadership Institute at a U.S. University, round-trip airfare, housing, health insurance, and Presidential Summit in Washington, D.C.
                </div>
              </div>
            </div>

            {/* Clear Callout Banner: AI does the organizing. You make the decision. */}
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-foreground flex items-center space-x-3">
              <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
              <div className="space-y-0.5">
                <span className="font-bold text-primary block">AI does the organizing. You make the decision.</span>
                <p className="text-muted-foreground text-[11px]">
                  Apply Away organizes requirements and tracks your timeline. We do NOT automatically submit applications for you.
                </p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
