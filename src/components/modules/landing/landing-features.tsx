"use client";

import React from "react";
import { Wand2, Clock, Calendar as CalendarIcon, BarChart3 } from "lucide-react";

const COMPONENT_FEATURES = [
  {
    title: "AI Capture Portal",
    desc: "Instantly translate messy PDF guidelines or webpage portals into structured pipeline records.",
    icon: Wand2,
    badge: "OpenAI v4",
  },
  {
    title: "Timezone-Aware Cron",
    desc: "Configures automatic dispatch windows (14d, 7d, 3d, 1d) matching your customized active profile timezone.",
    icon: Clock,
    badge: "node-cron",
  },
  {
    title: "Interactive Calendar",
    desc: "Full visual deadline timeline overview mapped out across standard month configurations.",
    icon: CalendarIcon,
    badge: "FullCalendar",
  },
  {
    title: "Analytics Conversion",
    desc: "Keep records of your submission rates, velocity curves, and top category counts dynamically.",
    icon: BarChart3,
    badge: "Recharts",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-purple-500/4 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">Platform capabilities</div>
          <h2 className="text-3xl font-bold font-outfit text-white">Full-Suite Pipeline Engine</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Designed for high-productivity students, researchers, and early-career innovators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMPONENT_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between h-56 hover:border-purple-500/20 transition-all text-left"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold font-outfit text-white">{feat.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-background border border-border text-slate-400 select-none">
                    {feat.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
