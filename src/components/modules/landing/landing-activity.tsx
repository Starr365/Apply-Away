"use client";

import React from "react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { History, CheckCircle2, FileText, Bookmark, Wand2 } from "lucide-react";

export function LandingActivity() {
  const timelineEvents = [
    { time: "Today", text: "Application submitted", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { time: "Yesterday", text: "Personal statement added", icon: FileText, color: "text-sky-500 bg-sky-500/10 border-sky-500/20" },
    { time: "Aug 12", text: "Requirements reviewed", icon: FileText, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    { time: "Aug 10", text: "Opportunity saved", icon: Bookmark, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { time: "Aug 10", text: "AI extracted opportunity details", icon: Wand2, color: "text-primary bg-primary/10 border-primary/20" },
  ];

  return (
    <section className="py-24 bg-card/30 border-t border-border/60 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <AnimatedContainer delay={100} className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            APPLICATION HISTORY TIMELINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-foreground tracking-tight">
            Remember what happened, <br />
            not just what you saved.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every opportunity maintains its own activity history so you can see your complete progress over time.
          </p>
        </AnimatedContainer>

        {/* Timeline Exhibition Card */}
        <AnimatedContainer delay={200} className="max-w-3xl mx-auto">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xl relative">
            <div className="flex items-center space-x-2 pb-4 border-b border-border">
              <History className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold font-outfit text-foreground">
                Activity Audit Feed
              </span>
            </div>

            <div className="space-y-4 relative pl-4 border-l border-border">
              {timelineEvents.map((evt, idx) => {
                const IconComponent = evt.icon;
                return (
                  <div key={idx} className="relative flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 -ml-8 ${evt.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-background border border-border flex-1 flex justify-between items-center text-xs">
                      <span className="font-bold text-foreground">{evt.text}</span>
                      <span className="text-[11px] font-semibold text-muted-foreground">{evt.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
