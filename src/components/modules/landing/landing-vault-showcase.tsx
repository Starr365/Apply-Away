"use client";

import React from "react";
import Link from "next/link";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers } from "lucide-react";

export function LandingVaultShowcase() {
  const demoVaultRecords = [
    {
      title: "Google STEP Internship",
      category: "INTERNSHIP",
      organization: "Google LLC",
      status: "IN_PROGRESS",
      statusLabel: "Preparing",
      statusColor: "text-sky-500 bg-sky-500/10 border-sky-500/20",
      deadline: "Aug 24",
      daysLeft: "3 Days Left",
    },
    {
      title: "Commonwealth Young Leaders",
      category: "FELLOWSHIP",
      organization: "Commonwealth Secretariat",
      status: "SUBMITTED",
      statusLabel: "Submitted",
      statusColor: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      deadline: "Sept 12",
      daysLeft: "Submitted",
    },
    {
      title: "Women Techsters Fellowship",
      category: "FELLOWSHIP",
      organization: "Tech4Dev Initiative",
      status: "ACCEPTED",
      statusLabel: "Accepted",
      statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      deadline: "Completed",
      daysLeft: "Accepted",
    },
  ];

  return (
    <section id="showcase" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <AnimatedContainer delay={100} className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            CENTRALIZED DASHBOARD
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-foreground tracking-tight">
            Your entire opportunity journey, <br />
            in one vault.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Sort, filter, and track applications across stages — from discovery to acceptance.
          </p>
        </AnimatedContainer>

        {/* Opportunity Vault Dashboard Card Exhibition */}
        <AnimatedContainer delay={200} className="max-w-5xl mx-auto">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Header Control Strip */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold font-outfit text-foreground">
                  Opportunity Vault Pipeline
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="px-3 py-1 rounded-lg bg-background border border-border font-semibold text-muted-foreground">
                  Demo Records Overview
                </span>
              </div>
            </div>

            {/* Opportunity Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demoVaultRecords.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-background border border-border space-y-4 hover:border-primary/40 transition-all text-left flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">
                        {rec.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${rec.statusColor}`}>
                        {rec.statusLabel}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-outfit text-foreground line-clamp-1">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{rec.organization}</p>
                  </div>

                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Deadline: {rec.deadline}</span>
                    <span className="font-semibold text-foreground">{rec.daysLeft}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-center">
              <Link href="/auth">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Your Vault
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
