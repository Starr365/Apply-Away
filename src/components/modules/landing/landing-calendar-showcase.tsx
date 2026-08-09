"use client";

import React from "react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Calendar as CalendarIcon, Globe, Clock, ArrowRight } from "lucide-react";

export function LandingCalendarShowcase() {
  const demoEvents = [
    { date: "Sept 10", title: "Rhodes Scholarship", type: "SCHOLARSHIP", time: "11:59 PM WAT", color: "border-sky-500/40 bg-sky-500/10 text-sky-500" },
    { date: "Sept 12", title: "Mandela Washington Fellowship", type: "FELLOWSHIP", time: "11:59 PM WAT", color: "border-purple-500/40 bg-purple-500/10 text-purple-500" },
    { date: "Sept 20", title: "Schwarzman Scholars", type: "FELLOWSHIP", time: "11:59 PM WAT", color: "border-indigo-500/40 bg-indigo-500/10 text-indigo-500" },
    { date: "Sept 28", title: "Google STEP Internship", type: "INTERNSHIP", time: "5:00 PM WAT", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500" },
    { date: "Oct 15", title: "National Innovation Grant", type: "GRANT", time: "11:59 PM WAT", color: "border-amber-500/40 bg-amber-500/10 text-amber-500" },
  ];

  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <AnimatedContainer delay={100} className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            TIMEZONE-AWARE CALENDAR
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-foreground tracking-tight">
            Know what's due before it's due.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Your deadlines, finally in one place — automatically converted to your local notification timezone.
          </p>
        </AnimatedContainer>

        {/* Calendar UI Showcase Composition */}
        <AnimatedContainer delay={200} className="max-w-5xl mx-auto">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Top Timezone Conversion Callout */}
            <div className="p-4 rounded-2xl bg-background border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-2 text-foreground font-semibold">
                <Globe className="w-4 h-4 text-primary" />
                <span>Automatic Timezone Conversion</span>
              </div>

              <div className="flex items-center space-x-3 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-muted-foreground">
                  Original: <strong>September 10 · 11:59 PM EST</strong>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold">
                  Your Local WAT: <strong>September 11 · 4:59 AM WAT</strong>
                </span>
              </div>
            </div>

            {/* Calendar Agenda Preview */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Upcoming Deadline Timeline
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {demoEvents.map((evt, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-background border border-border space-y-2 hover:border-primary/40 transition-all">
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase ${evt.color}`}>
                        {evt.type}
                      </span>
                      <span className="text-xs font-bold text-foreground">{evt.date}</span>
                    </div>

                    <div className="font-semibold text-xs text-foreground line-clamp-1">
                      {evt.title}
                    </div>

                    <div className="text-[10px] text-muted-foreground flex items-center space-x-1 pt-1 border-t border-border/40">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>Due {evt.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
