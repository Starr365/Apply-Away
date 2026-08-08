"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Wand2 } from "lucide-react";
import { AnimatedContainer } from "@/components/ui/animated-container";

interface ParsedOpportunity {
  title: string;
  organization: string;
  deadline: string;
  category: string;
  priority: string;
  status: string;
}

export function LandingHero() {
  const [urlInput] = useState("https://www.schwarzmanscholars.org/apply");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedOpportunity | null>(null);

  const handleSimulateParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      setParsedData({
        title: "Schwarzman Scholars Fellowship",
        organization: "Tsinghua University",
        deadline: "2026-09-20",
        category: "FELLOWSHIP",
        priority: "HIGH",
        status: "NOT_STARTED",
      });
      setIsParsing(false);
    }, 1800);
  };

  return (
    <section className="relative pt-32 pb-24 overflow-hidden px-4 sm:px-6">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-87.5 h-87.5 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Info Column */}
        <AnimatedContainer delay={200} className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mx-auto lg:mx-0">
            <div className="relative w-4 h-4">
              <Image src="/vault-logo.png" alt="Icon" fill sizes="16px" className="object-contain" />
            </div>
            <span>AI-Powered Opportunity Vault</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-outfit text-foreground">
            Never miss another <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 via-indigo-400 to-sky-400 font-bold">
              life-changing
            </span>{" "}
            opportunity.
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Consolidate scholarships, research grants, fellowships, and career opportunities into one beautiful workspace. Automatically parse deadlines and sync notifications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/auth"
              className="h-12 px-6 w-full sm:w-auto rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-bold text-white shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#how-it-works"
              className="h-12 px-5 w-full sm:w-auto rounded-xl border border-border bg-card/30 hover:bg-card hover:border-purple-500/20 text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer text-foreground"
            >
              <span>See How It Works</span>
            </a>
          </div>

          <div className="flex items-center justify-center lg:justify-start space-x-2 text-[11px] text-muted-foreground select-none">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Multi-Tenant Vault Database Isolation</span>
          </div>
        </AnimatedContainer>

        {/* Right Product Mockup Column */}
        <AnimatedContainer delay={300} className="lg:col-span-7">
          <div className="relative rounded-2xl border border-border/80 bg-card/65 backdrop-blur-md shadow-2xl p-4 sm:p-5 overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
            {/* Header window control strip */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-6 py-0.5 rounded-lg bg-background/60 border border-border/40 text-[10px] font-mono text-muted-foreground max-w-xs truncate select-none">
                apply-away.app/dashboard
              </div>
              <div className="w-12" />
            </div>

            {/* Dashboard Body mockup */}
            <div className="pt-5 space-y-5 text-left">
              
              {/* Metrics cards */}
              <div className="grid grid-cols-3 gap-3 select-none">
                <div className="p-3 rounded-xl bg-background/85 border border-border/60 space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Vault</span>
                  <div className="text-lg font-bold font-outfit text-foreground">18 Records</div>
                </div>
                <div className="p-3 rounded-xl bg-background/85 border border-border/60 space-y-1">
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 uppercase font-bold tracking-wider">In Progress</span>
                  <div className="text-lg font-bold font-outfit text-sky-600 dark:text-sky-400">5 Active</div>
                </div>
                <div className="p-3 rounded-xl bg-background/85 border border-border/60 space-y-1">
                  <span className="text-[10px] text-purple-650 dark:text-purple-400 uppercase font-bold tracking-wider">Due Soon</span>
                  <div className="text-lg font-bold font-outfit text-purple-650 dark:text-purple-400">2 Weeks</div>
                </div>
              </div>

              {/* Extraction portal preview */}
              <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <Wand2 className="w-3.5 h-3.5 animate-pulse" />
                    <span>Interactive AI Capture Demo</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 uppercase select-none">
                    Try clicking below
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={urlInput}
                    className="flex-1 h-9 px-3 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none"
                  />
                  <button
                    onClick={handleSimulateParse}
                    disabled={isParsing}
                    className="h-9 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isParsing ? "Extracting..." : "Parse link"}
                  </button>
                </div>

                {parsedData ? (
                  <div className="p-3 rounded-lg bg-background border border-emerald-500/20 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">{parsedData.title}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase border border-emerald-500/20">
                        {parsedData.category}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                      <div>Deadline: <strong className="text-slate-700 dark:text-slate-300">{parsedData.deadline}</strong></div>
                      <div>Priority: <strong className="text-amber-600 dark:text-amber-400">{parsedData.priority}</strong></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-muted-foreground italic text-center py-1 select-none">
                    Click &apos;Parse link&apos; to simulate extracting details from guidelines.
                  </div>
                )}
              </div>

              {/* Pipeline Lists mockup */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider select-none">Vault Pipeline</div>
                <div className="p-3.5 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div>
                      <div className="font-semibold text-foreground">Rhodes Scholarship Application</div>
                      <div className="text-[10px] text-muted-foreground">Oxford University</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold uppercase text-[9px] select-none">
                    HIGH PRIORITY
                  </span>
                </div>
              </div>

            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
