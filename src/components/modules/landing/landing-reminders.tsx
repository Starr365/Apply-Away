"use client";

import React from "react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Bell, Mail, Smartphone, ArrowRight, ShieldCheck } from "lucide-react";

export function LandingReminders() {
  return (
    <section className="py-24 bg-card/40 border-t border-border/60 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <AnimatedContainer delay={100} className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            SMART NOTIFICATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-foreground tracking-tight">
            A deadline shouldn't surprise you.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Multi-tier reminders ensure you have enough runway to write your essays and gather recommendations without last-minute panic.
          </p>
        </AnimatedContainer>

        {/* Mobile Smartphone Notification Mockups Showcase */}
        <AnimatedContainer delay={200} className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
            {/* Phone Notification Card 1 */}
            <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-primary text-slate-950 font-bold flex items-center justify-center text-xs">
                    AA
                  </div>
                  <span className="text-xs font-bold text-foreground">Apply Away</span>
                </div>
                <span className="text-[10px] text-muted-foreground">3 Days Left</span>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
                <div className="text-xs font-bold text-foreground">
                  Your fellowship deadline is in 3 days.
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Schwarzman Scholars · September 20 · 11:59 PM WAT
                </div>
                <div className="pt-2 flex justify-end">
                  <span className="text-[11px] font-bold text-primary hover:underline flex items-center space-x-1 cursor-pointer">
                    <span>View Opportunity</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground flex items-center space-x-1.5 pt-1">
                <Bell className="w-3.5 h-3.5 text-primary" />
                <span>Triggered at 3-Day Milestone</span>
              </div>
            </div>

            {/* Phone Notification Card 2 */}
            <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                    AA
                  </div>
                  <span className="text-xs font-bold text-foreground">Apply Away Urgent</span>
                </div>
                <span className="text-[10px] font-bold text-amber-500">12 Hours Left</span>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-amber-500/30 space-y-2">
                <div className="text-xs font-bold text-amber-500">
                  12 hours left to apply.
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Commonwealth Master's Scholarship · Oct 17 · 4:00 PM WAT
                </div>
                <div className="pt-2 flex justify-end">
                  <span className="text-[11px] font-bold text-amber-500 hover:underline flex items-center space-x-1 cursor-pointer">
                    <span>Open Application URL</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground flex items-center space-x-1.5 pt-1">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>Dispatched via Email & Web Push</span>
              </div>
            </div>
          </div>

          {/* Reminder Milestones List */}
          <div className="mt-8 p-4 rounded-2xl bg-card border border-border text-center flex flex-wrap justify-center items-center gap-4 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Configurable Reminder Tiers:</span>
            <span className="px-2.5 py-1 rounded-lg bg-background border border-border text-foreground font-mono">3-Day</span>
            <span className="px-2.5 py-1 rounded-lg bg-background border border-border text-foreground font-mono">2-Day</span>
            <span className="px-2.5 py-1 rounded-lg bg-background border border-border text-foreground font-mono">1-Day</span>
            <span className="px-2.5 py-1 rounded-lg bg-background border border-border text-foreground font-mono">24-Hour</span>
            <span className="px-2.5 py-1 rounded-lg bg-background border border-border text-foreground font-mono">12-Hour</span>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
