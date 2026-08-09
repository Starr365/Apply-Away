"use client";

import React from "react";
import { LandingHeader } from "@/components/modules/landing/landing-header";
import { LandingHero } from "@/components/modules/landing/landing-hero";
import { LandingProblem } from "@/components/modules/landing/landing-problem";
import { LandingSave } from "@/components/modules/landing/landing-save";
import { LandingAIExtraction } from "@/components/modules/landing/landing-ai-extraction";
import { LandingCalendarShowcase } from "@/components/modules/landing/landing-calendar-showcase";
import { LandingReminders } from "@/components/modules/landing/landing-reminders";
import { LandingVaultShowcase } from "@/components/modules/landing/landing-vault-showcase";
import { LandingActivity } from "@/components/modules/landing/landing-activity";
import { LandingReflectionShowcase } from "@/components/modules/landing/landing-reflection-showcase";
import { LandingHuman } from "@/components/modules/landing/landing-human";
import { LandingFAQ } from "@/components/modules/landing/landing-faq";
import { LandingCTA } from "@/components/modules/landing/landing-cta";
import { LandingFooter } from "@/components/modules/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Section 1: Navigation */}
      <LandingHeader />

      {/* Section 2: Hero */}
      <LandingHero />

      {/* Section 3: Problem Section */}
      <LandingProblem />

      {/* Section 4: Save Opportunities (AI Extraction Animation Demo) */}
      <LandingSave />

      {/* Section 5: AI Extraction Record Showcase */}
      <LandingAIExtraction />

      {/* Section 6: Timezone-Aware Calendar */}
      <LandingCalendarShowcase />

      {/* Section 7: Deadline Reminders */}
      <LandingReminders />

      {/* Section 8: Opportunity Vault */}
      <LandingVaultShowcase />

      {/* Section 9: Activity Log Timeline */}
      <LandingActivity />

      {/* Section 10: Personal Reflection Dashboard */}
      <LandingReflectionShowcase />

      {/* Section 11: Human / Photography Section */}
      <LandingHuman />

      {/* Section 12: FAQ Accordion */}
      <LandingFAQ />

      {/* Section 13: Final High-Impact CTA */}
      <LandingCTA />

      {/* Section 14: Rich Footer */}
      <LandingFooter />
    </div>
  );
}
