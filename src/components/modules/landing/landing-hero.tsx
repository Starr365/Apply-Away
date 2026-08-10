"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section id="hero" className="relative pt-28 sm:pt-36 pb-20 overflow-hidden px-4 sm:px-6">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-87.5 h-87.5 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        {/* Top Centered Hero Header */}
        <AnimatedContainer delay={100} className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm font-bold text-primary tracking-wide uppercase mx-auto select-none">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>YOUR OPPORTUNITIES, FINALLY ORGANIZED</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-outfit text-foreground leading-[1.1]">
            Stop losing opportunities. <br />
            <span className="text-primary">Start applying with intention.</span>
          </h1>

          <p className="text-base sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Apply Away is your personal opportunity vault for scholarships, fellowships, internships, grants, jobs, conferences, and more. Save an opportunity, let AI organize the details, and never lose track of a deadline again.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/auth" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto font-extrabold text-slate-950 px-8"
              >
                Start Building Your Vault
              </Button>
            </Link>

            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground pt-1">
            <Shield className="w-4 h-4 text-primary" />
            <span>Private & Encrypted Personal Vault</span>
          </div>
        </AnimatedContainer>

        {/* Product Showcase Exhibition: Apple-Style Product Preview + Real Stock Photo */}
        <AnimatedContainer delay={300} className="relative max-w-6xl mx-auto">
          <div className="rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-2xl p-4 sm:p-8 space-y-6 overflow-hidden">
            {/* Header window control bar */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-4 py-1 rounded-lg bg-background/80 border border-border text-[11px] font-mono text-muted-foreground truncate select-none">
                apply-away.app/dashboard
              </div>
              <div className="w-12" />
            </div>

            {/* Split Composition: Real Product Metrics & Cards + Real Stock Photograph */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Real Opportunity Vault Cards */}
              <div className="lg:col-span-7 space-y-4">
                {/* Metric Strip */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Vault</span>
                    <div className="text-xl font-bold font-outfit text-foreground">24 Saved</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                    <span className="text-[10px] uppercase font-bold text-primary">In Progress</span>
                    <div className="text-xl font-bold font-outfit text-primary">8 Active</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-500">Submitted</span>
                    <div className="text-xl font-bold font-outfit text-emerald-500">11 Sent</div>
                  </div>
                </div>

                {/* Real UI Preview Opportunity Cards */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">
                        FELLOWSHIP
                      </span>
                      <span className="text-xs font-bold text-foreground">Schwarzman Scholars</span>
                    </div>
                    <span className="text-xs font-semibold text-amber-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>12 Days Left</span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Fully-funded one-year master’s degree at Tsinghua University in Beijing designed to build global leaders.
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                    <span>Deadline: Sept 20 · 11:59 PM WAT</span>
                    <span className="text-primary font-semibold">In Progress</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase">
                        INTERNSHIP
                      </span>
                      <span className="text-xs font-bold text-foreground">Google STEP Program</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-500 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Submitted</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Organization: Google LLC</span>
                    <span>Submitted Aug 14</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Real Stock Photo Integration (iStock Student Laptop Collection) */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden min-h-65 border border-border group">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  alt="University students working on laptops and organizing application deadlines"
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent p-4 flex flex-col justify-end">
                  <div className="p-3 rounded-xl bg-background/90 backdrop-blur-md border border-border text-xs space-y-1">
                    <span className="font-bold text-foreground block">Built for Opportunity Hunters</span>
                    <span className="text-[11px] text-muted-foreground block">
                      Keep your applications, deadlines, and reflections in one unified vault.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
