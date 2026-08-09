"use client";

import React from "react";
import { LandingHeader } from "@/components/modules/landing/landing-header";
import { LandingHero } from "@/components/modules/landing/landing-hero";
import { LandingProblem } from "@/components/modules/landing/landing-problem";
import { LandingSave } from "@/components/modules/landing/landing-save";
import { LandingFeaturesGrid } from "@/components/modules/landing/landing-features-grid";
import { LandingHuman } from "@/components/modules/landing/landing-human";
import { LandingFAQ } from "@/components/modules/landing/landing-faq";
import { LandingCTA } from "@/components/modules/landing/landing-cta";
import { LandingFooter } from "@/components/modules/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation Header */}
      <LandingHeader />

      {/* Hero Section */}
      <LandingHero />

      {/* Application Chaos Problem */}
      <LandingProblem />

      {/* Save Opportunities & AI Demo */}
      <LandingSave />

      {/* Streamlined Opportunity Vault Ecosystem Grid */}
      <LandingFeaturesGrid />

      {/* Human Photography Section */}
      <LandingHuman />

      {/* FAQ Accordion */}
      <LandingFAQ />

      {/* Final High-Impact CTA */}
      <LandingCTA />

      {/* Rich Footer */}
      <LandingFooter />
    </div>
  );
}
