"use client";

import React from "react";
import { BarChart3, Calendar as CalendarIcon } from "lucide-react";

export function LandingShowcase() {
  return (
    <section id="showcase" className="py-24 px-4 sm:px-6 bg-card/10">
      <div className="max-w-7xl mx-auto space-y-20">
        
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">Product Showcase</div>
          <h2 className="text-3xl font-bold font-outfit text-white">High-Fidelity Interface</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            A visually premium dashboard tailored specifically to opportunity vault tracking.
          </p>
        </div>

        {/* Showcase Items */}
        <div className="space-y-20">
          
          {/* Showcase 1: Recharts Velocity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
            <div className="lg:col-span-5 space-y-5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-white">Reflection & Analytics</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Track application velocity curves, conversion pipelines (Not Started → Submitted → Accepted), and categories breakdown. Visual charts provide an instant health audit of your career progression.
              </p>
              <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 select-none">
                <span>Standard chart rendering via Recharts library</span>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-border space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-border/50 text-xs select-none">
                  <span className="font-bold text-white">Application Velocity Index</span>
                  <div className="flex space-x-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] font-bold text-purple-400">6 MONTHS</span>
                  </div>
                </div>
                
                <div className="h-48 rounded-xl bg-background/80 border border-border/60 flex items-end justify-between p-4 relative overflow-hidden select-none">
                  <div className="absolute inset-0 bg-linear-to-t from-purple-500/[0.02] to-transparent pointer-events-none" />
                  
                  {/* Bars */}
                  {["Mar", "Apr", "May", "Jun"].map((month, idx) => {
                    const heights = [30, 45, 65, 85];
                    const subHeights = [15, 25, 40, 60];
                    return (
                      <div key={idx} className="w-10 flex flex-col justify-end items-center space-y-2 h-full">
                        <div className="w-2.5 bg-purple-500/30 rounded-t" style={{ height: `${subHeights[idx]}%` }} />
                        <div className="w-2.5 bg-purple-500 rounded-t" style={{ height: `${heights[idx]}%` }} />
                        <span className="text-[8px] text-slate-500">{month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground select-none">
                  <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded bg-purple-500/30" /> <span>Created</span></span>
                  <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded bg-purple-500" /> <span>Submitted</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Showcase 2: FullCalendar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
            <div className="lg:col-span-7 order-last lg:order-first">
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-border shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/50 text-xs select-none">
                  <span className="font-bold text-white">September 2026</span>
                  <span className="text-[10px] text-muted-foreground">FullCalendar integration</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider select-none">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 select-none">
                  {Array.from({ length: 28 }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const hasDeadline = dayNum === 14 || dayNum === 20;
                    return (
                      <div
                        key={idx}
                        className={`h-10 rounded-lg border border-border/40 bg-background/40 flex flex-col justify-between p-1.5 ${
                          hasDeadline ? "border-purple-500/30 bg-purple-500/[0.02]" : ""
                        }`}
                      >
                        <span className="text-[8px] text-slate-500">{dayNum}</span>
                        {hasDeadline && (
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 self-end" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-white">Deadline Calendar View</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Consolidated timeline display highlighting upcoming fellowship, scholarship, and grant deadlines. Standard priority tags render high, medium, and low colors to organize your study windows.
              </p>
              <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 select-none">
                <span>Synchronized with custom client dynamic loader</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
