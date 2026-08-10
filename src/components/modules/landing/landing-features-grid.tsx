"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import {
  Wand2,
  Calendar,
  Bell,
  Layers,
  History,
  BookOpen,
  X,
  Maximize2,
  ExternalLink,
  Globe,
  ShieldAlert,
} from "lucide-react";

interface FeatureCardItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ElementType;
  imageSrc: string;
  modalContent: {
    subtitle: string;
    details: React.ReactNode;
  };
}

export function LandingFeaturesGrid() {
  const [activeModal, setActiveModal] = useState<FeatureCardItem | null>(null);

  // Background body scroll lock when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal]);

  const features: FeatureCardItem[] = [
    {
      id: "ai-structuring",
      badge: "AI EXTRACTION",
      title: "Intelligent Structuring",
      description: "From messy URL guidelines or copied text to organized opportunity records in seconds.",
      icon: Wand2,
      imageSrc: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      modalContent: {
        subtitle: "From announcement guidelines to structured opportunity in seconds",
        details: (
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-card border border-border space-y-4 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">
                    FELLOWSHIP
                  </span>
                  <h4 className="text-base font-bold font-outfit text-foreground mt-1">
                    Mandela Washington Fellowship 2026
                  </h4>
                  <p className="text-xs text-muted-foreground">U.S. Department of State · YALI Initiative</p>
                </div>
                <a
                  href="https://yali.state.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline font-semibold text-[11px] flex items-center space-x-1"
                >
                  <span>Official URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-background border border-border space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Deadline</span>
                  <div className="font-bold text-amber-500">Sept 12, 2026 · 11:59 PM WAT</div>
                  <span className="text-[10px] text-muted-foreground">Converted from 5:50 PM EST</span>
                </div>
                <div className="p-3 rounded-xl bg-background border border-border space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Eligibility</span>
                  <div className="font-bold text-foreground">Ages 25–35 · Sub-Saharan Africa</div>
                  <span className="text-[10px] text-muted-foreground">Leadership record required</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-background border border-border space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Benefits & Coverage</span>
                <div className="text-muted-foreground text-[11px] leading-relaxed">
                  Full 6-week Executive Leadership Institute at a U.S. University, round-trip airfare, housing, health insurance, and Presidential Summit in D.C.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-foreground flex items-center space-x-3">
              <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
              <div className="space-y-0.5">
                <span className="font-bold text-primary block">AI does the organizing. You make the decision.</span>
                <p className="text-muted-foreground text-[11px]">
                  Apply Away structures guidelines and tracks your timeline. It does NOT automatically submit applications.
                </p>
              </div>
            </div>
          </div>
        ),
      },
    },
    {
      id: "timezone-calendar",
      badge: "SMART CALENDAR",
      title: "Timezone-Aware Calendar",
      description: "Know what's due before it's due with automatic conversion to your local WAT timezone.",
      icon: Calendar,
      imageSrc: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
      modalContent: {
        subtitle: "Original EST deadlines auto-converted to your local notification timezone",
        details: (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-background border border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-foreground font-semibold">
                <Globe className="w-4 h-4 text-primary" />
                <span>Automatic Conversion Rule</span>
              </div>
              <div className="text-[11px]">
                Original: <strong className="text-muted-foreground">Sept 10 · 11:59 PM EST</strong> &rarr;{" "}
                <span className="text-primary font-bold">Sept 11 · 4:59 AM WAT</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-card border border-border space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-[9px] font-bold text-sky-500 uppercase">
                  SCHOLARSHIP
                </span>
                <div className="font-bold text-foreground">Rhodes Scholarship</div>
                <div className="text-[10px] text-muted-foreground">Due Sept 10 · 11:59 PM WAT</div>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[9px] font-bold text-purple-500 uppercase">
                  FELLOWSHIP
                </span>
                <div className="font-bold text-foreground">Schwarzman Scholars</div>
                <div className="text-[10px] text-muted-foreground">Due Sept 20 · 11:59 PM WAT</div>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-500 uppercase">
                  INTERNSHIP
                </span>
                <div className="font-bold text-foreground">Google STEP Program</div>
                <div className="text-[10px] text-muted-foreground">Due Sept 28 · 5:00 PM WAT</div>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase">
                  GRANT
                </span>
                <div className="font-bold text-foreground">National Innovation Grant</div>
                <div className="text-[10px] text-muted-foreground">Due Oct 15 · 11:59 PM WAT</div>
              </div>
            </div>
          </div>
        ),
      },
    },
    {
      id: "deadline-reminders",
      badge: "NOTIFICATIONS",
      title: "Multi-Tier Reminders",
      description: "A deadline shouldn't surprise you. Multi-tier alerts at 3-day, 24-hr, and 12-hr milestones.",
      icon: Bell,
      imageSrc: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
      modalContent: {
        subtitle: "Never get caught off guard by a closing application window",
        details: (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-foreground">Apply Away Alert</span>
                <span className="text-[10px] text-muted-foreground">3 Days Left</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Your fellowship deadline for <strong>Schwarzman Scholars</strong> is in 3 days (Sept 20 · 11:59 PM WAT).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-amber-500/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-500">Urgent Reminder</span>
                <span className="text-[10px] font-bold text-amber-500">12 Hours Left</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                12 hours remaining for <strong>Commonwealth Master&apos;s Scholarship</strong>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-background border border-border flex justify-between items-center text-[11px] text-muted-foreground">
              <span>Delivery Channels:</span>
              <span className="font-semibold text-primary">Web Push & Email Dispatches</span>
            </div>
          </div>
        ),
      },
    },
    {
      id: "vault-pipeline",
      badge: "OPPORTUNITY VAULT",
      title: "Centralized Pipeline",
      description: "Track your entire journey in one vault — from Not Started → Submitted → Accepted.",
      icon: Layers,
      imageSrc: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      modalContent: {
        subtitle: "All your applications organized in a single unified dashboard",
        details: (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-500 font-bold text-[9px] uppercase border border-sky-500/20">
                  INTERNSHIP
                </span>
                <h5 className="font-bold text-foreground mt-1">Google STEP Internship</h5>
                <span className="text-[10px] text-muted-foreground">Google LLC · Preparing</span>
              </div>
              <span className="text-xs font-bold text-sky-500">3 Days Left</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-500 font-bold text-[9px] uppercase border border-purple-500/20">
                  FELLOWSHIP
                </span>
                <h5 className="font-bold text-foreground mt-1">Commonwealth Young Leaders</h5>
                <span className="text-[10px] text-muted-foreground">Commonwealth Secretariat · Submitted</span>
              </div>
              <span className="text-xs font-bold text-purple-500">Submitted</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold text-[9px] uppercase border border-emerald-500/20">
                  FELLOWSHIP
                </span>
                <h5 className="font-bold text-foreground mt-1">Women Techsters Fellowship</h5>
                <span className="text-[10px] text-muted-foreground">Tech4Dev Initiative · Accepted</span>
              </div>
              <span className="text-xs font-bold text-emerald-500">Accepted</span>
            </div>
          </div>
        ),
      },
    },
    {
      id: "activity-audit",
      badge: "ACTIVITY LOG",
      title: "Audit History Feed",
      description: "Remember what happened, not just what you saved. Complete timestamped application history.",
      icon: History,
      imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      modalContent: {
        subtitle: "Timestamped trail of every action taken on an opportunity",
        details: (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-card border border-border flex justify-between items-center">
              <span className="font-bold text-emerald-500">Application submitted</span>
              <span className="text-[10px] text-muted-foreground">Today</span>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border flex justify-between items-center">
              <span className="font-bold text-sky-500">Personal statement added</span>
              <span className="text-[10px] text-muted-foreground">Yesterday</span>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border flex justify-between items-center">
              <span className="font-bold text-purple-500">Requirements reviewed</span>
              <span className="text-[10px] text-muted-foreground">Aug 12</span>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border flex justify-between items-center">
              <span className="font-bold text-amber-500">Opportunity saved</span>
              <span className="text-[10px] text-muted-foreground">Aug 10</span>
            </div>
          </div>
        ),
      },
    },
    {
      id: "reflection-tool",
      badge: "REFLECTION TOOL",
      title: "Personal Reflection",
      description: "Look back. Learn. Keep going. Personal metrics and monthly reflection journal notes.",
      icon: BookOpen,
      imageSrc: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      modalContent: {
        subtitle: "Reflect on your growth and progress without competitive pressure",
        details: (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[9px] text-muted-foreground block font-bold">SAVED</span>
                <span className="text-lg font-bold text-foreground">24</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[9px] text-primary block font-bold">SENT</span>
                <span className="text-lg font-bold text-primary">11</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[9px] text-emerald-500 block font-bold">WINS</span>
                <span className="text-lg font-bold text-emerald-500">3</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[9px] text-rose-500 block font-bold">REJECTS</span>
                <span className="text-lg font-bold text-rose-500">4</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-primary font-bold text-[11px] block">August Reflection Journal</span>
              <p className="text-muted-foreground italic text-[11px] leading-relaxed">
                &quot;You saved more fellowship opportunities this month and submitted more applications than last month.&quot;
              </p>
            </div>
          </div>
        ),
      },
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <AnimatedContainer delay={100} className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-widest">
            THE OPPORTUNITY VAULT ECOSYSTEM
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-outfit text-foreground tracking-tight leading-tight">
            Everything you need in one unified vault.
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Click or hover any feature card below to open an interactive full-screen detail preview.
          </p>
        </AnimatedContainer>

        {/* 6-Card Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <AnimatedContainer key={feat.id} delay={150 + idx * 50}>
                <div
                  onClick={() => setActiveModal(feat)}
                  className="group relative rounded-3xl border border-border bg-card p-5 space-y-4 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer overflow-hidden flex flex-col justify-between h-full"
                >
                  <div className="space-y-3">
                    {/* Thumbnail Image Container (iStock stock photo style) */}
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-border/60">
                      <Image
                        src={feat.imageSrc}
                        alt={feat.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 350px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent p-3 flex flex-col justify-between">
                        <span className="self-start px-2.5 py-0.5 rounded-md bg-background/80 backdrop-blur-md border border-border text-[10px] font-bold text-primary uppercase">
                          {feat.badge}
                        </span>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-1.5 py-1 px-3 rounded-xl bg-primary text-slate-950 text-xs font-bold shadow-lg self-center">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Quick Preview</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-foreground font-bold text-base font-outfit pt-1">
                      <IconComp className="w-5 h-5 text-primary shrink-0" />
                      <span>{feat.title}</span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-primary font-semibold">
                    <span>Explore Feature</span>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </div>
              </AnimatedContainer>
            );
          })}
        </div>
      </div>

      {/* Interactive Detail Modal Preview */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-border shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  {React.createElement(activeModal.icon, { className: "w-5 h-5" })}
                </div>
                <div>
                  <h3 className="text-xl font-bold font-outfit text-foreground">
                    {activeModal.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {activeModal.modalContent.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close modal preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Interactive Content */}
            {activeModal.modalContent.details}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-border flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Press ESC or click close to dismiss</span>
              <Button variant="primary" size="sm" onClick={() => setActiveModal(null)}>
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
