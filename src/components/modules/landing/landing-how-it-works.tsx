"use client";

import { Wand2, Clock } from "lucide-react";
import { AnimatedContainer } from "@/components/ui/animated-container";

const STEPS = [
  {
    num: "01",
    title: "Capture Instantly",
    desc: "Paste an application link or dump raw fellowship guidelines. No forms required.",
    visual: "LINK_CAPTURE",
  },
  {
    num: "02",
    title: "AI Extraction",
    desc: "Our model parses the title, sponsor, official portals, criteria, and deadline parameters in seconds.",
    visual: "AI_PARSER",
  },
  {
    num: "03",
    title: "Automated Tracking",
    desc: "We trigger calendar timelines and email notification cron alerts matching your timezone.",
    visual: "TIMELINE_CRON",
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-card/10 border-t border-b border-border/40">
      <div className="max-w-7xl mx-auto space-y-16">
        <AnimatedContainer delay={100} className="text-center space-y-3 max-w-xl mx-auto">
          <div className="text-xs font-bold text-purple-605 dark:text-purple-400 uppercase tracking-widest">Simplifying Tracking</div>
          <h2 className="text-3xl font-bold font-outfit text-foreground">Paste, Extract, Automate.</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Say goodbye to messy bookmarks and spreadsheets. We parse structural parameters and cron notify your timeline.
          </p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, idx) => (
            <AnimatedContainer
              key={step.num}
              delay={200 + idx * 100}
              className="bg-card/45 backdrop-blur-md border border-border/80 p-6 rounded-2xl space-y-4 hover:border-purple-500/20 transition-all text-left"
            >
              <div className="text-3xl font-extrabold font-outfit text-purple-500/35">{step.num}</div>
              <h3 className="text-base font-bold font-outfit text-foreground">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              
              {/* Visual Indicators */}
              <div className="pt-4 h-24 rounded-xl bg-background/60 border border-border/50 flex items-center justify-center p-3">
                {step.visual === "LINK_CAPTURE" && (
                  <div className="w-full space-y-2">
                    <div className="h-6 rounded bg-slate-100 dark:bg-slate-900 border border-border/60 text-[10px] text-purple-605 dark:text-purple-400 flex items-center px-2 select-none overflow-hidden truncate">
                      https://gatesfoundation.org/grant-apply
                    </div>
                  </div>
                )}
                {step.visual === "AI_PARSER" && (
                  <div className="flex space-x-2 items-center text-xs text-purple-600 dark:text-purple-300 font-mono">
                    <Wand2 className="w-4 h-4 text-purple-650 dark:text-purple-400 animate-pulse" />
                    <span>Parsing guidelines...</span>
                  </div>
                )}
                {step.visual === "TIMELINE_CRON" && (
                  <div className="flex items-center space-x-2 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Cron triggers armed (UTC +1)</span>
                  </div>
                )}
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
