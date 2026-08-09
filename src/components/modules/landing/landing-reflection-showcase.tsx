"use client";

import React from "react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { BookOpen, BarChart3 } from "lucide-react";

export function LandingReflectionShowcase() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <AnimatedContainer delay={100} className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            PERSONAL REFLECTION TOOL
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-foreground tracking-tight">
            Look back. Learn. Keep going.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Not for business analytics or competition. This is your personal journal to reflect on your journey, celebrate progress, and refine your application strategy.
          </p>
        </AnimatedContainer>

        {/* Reflection Metrics & Visual Journal Composition */}
        <AnimatedContainer delay={200} className="max-w-5xl mx-auto">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Personal Reflection Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Opportunities Saved</span>
                <div className="text-2xl font-extrabold font-outfit text-foreground">24</div>
              </div>
              <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-primary">Applications Submitted</span>
                <div className="text-2xl font-extrabold font-outfit text-primary">11</div>
              </div>
              <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-500">Wins & Offers</span>
                <div className="text-2xl font-extrabold font-outfit text-emerald-500">3</div>
              </div>
              <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-500">Rejections & Growth</span>
                <div className="text-2xl font-extrabold font-outfit text-rose-500">4</div>
              </div>
            </div>

            {/* Visual Charts & Journal Entry Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Category Velocity Visual Bars */}
              <div className="md:col-span-6 p-5 rounded-2xl bg-background border border-border space-y-4 text-left">
                <div className="flex items-center space-x-2 text-xs font-bold text-foreground">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span>Applications Over Time (Monthly Trend)</span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Fellowships</span>
                      <span>10 Applications (42%)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[42%]" />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Scholarships</span>
                      <span>7 Applications (29%)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-sky-400 rounded-full w-[29%]" />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Internships & Jobs</span>
                      <span>5 Applications (21%)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full w-[21%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Journal Note Card */}
              <div className="md:col-span-6 p-5 rounded-2xl bg-background border border-border space-y-3 text-left flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-primary font-bold text-xs">
                    <BookOpen className="w-4 h-4" />
                    <span>Your August Reflection Journal</span>
                  </div>
                  <p className="text-xs text-foreground italic leading-relaxed">
                    &quot;You saved more fellowship opportunities this month and submitted more applications than last month.&quot;
                  </p>
                </div>

                <div className="pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Logged for August 2026</span>
                  <span className="text-primary font-semibold">Private Reflection</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
