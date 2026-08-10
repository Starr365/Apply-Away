"use client";

import React from "react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { ArrowDown, Layers, Check } from "lucide-react";

export function LandingProblem() {
  const scatteredSources = [
    { name: "WhatsApp Groups", desc: "Pinned messages & forwarded links" },
    { name: "LinkedIn Posts", desc: "Saved posts you forget to revisit" },
    { name: "Telegram Channels", desc: "Notification noise & lost PDFs" },
    { name: "X (Twitter) Threads", desc: "Bookmarked opportunity tweets" },
    { name: "Email Newsletters", desc: "Unread digest subscriptions" },
    { name: "Browser Bookmarks", desc: "27 open tabs buried in folders" },
    { name: "Phone Notes", desc: "Unstructured copy-pasted text" },
    { name: "Gallery Screenshots", desc: "Image screenshots of deadlines" },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-card/40 border-y border-border/60 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Problem Header */}
        <AnimatedContainer delay={100} className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-widest">
            THE APPLICATION CHAOS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-outfit text-foreground tracking-tight leading-tight">
            You shouldn&apos;t need five apps to manage one application.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Opportunities arrive from everywhere. When deadlines are scattered across bookmarks, notes, and screenshots, critical details slip through the cracks.
          </p>
        </AnimatedContainer>

        {/* Scattered Sources Grid Flowing Down */}
        <div className="max-w-5xl mx-auto space-y-8">
          <AnimatedContainer delay={200} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {scatteredSources.map((source, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-card border border-border/70 space-y-1 hover:border-primary/40 transition-all text-left"
              >
                <div className="text-xs font-bold text-foreground">{source.name}</div>
                <div className="text-[11px] text-muted-foreground leading-tight">{source.desc}</div>
              </div>
            ))}
          </AnimatedContainer>

          {/* Converging Flow Arrow */}
          <div className="flex flex-col items-center justify-center space-y-2 text-primary">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              ALL CONVERGE INTO
            </span>
          </div>

          {/* The Solution: Centralized Apply Away Vault */}
          <AnimatedContainer delay={300} className="max-w-2xl mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-primary/10 border border-primary/30 space-y-4 text-center relative overflow-hidden shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-primary text-slate-950 font-bold flex items-center justify-center mx-auto shadow-md shadow-primary/20">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-outfit text-foreground">
                Apply Away Opportunity Vault
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
                One organized workspace that extracts details, tracks deadlines, converts timezones, and keeps your entire journey clear.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-foreground">
                <span className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Automatic AI Extraction</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Timezone Conversion</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Deadline Reminders</span>
                </span>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
}
