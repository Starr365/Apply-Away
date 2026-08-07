"use client";

import React from "react";
import { LandingHeader } from "@/components/modules/landing/landing-header";
import { LandingHero } from "@/components/modules/landing/landing-hero";
import { LandingTrust } from "@/components/modules/landing/landing-trust";
import { LandingHowItWorks } from "@/components/modules/landing/landing-how-it-works";
import { LandingFeatures } from "@/components/modules/landing/landing-features";
import { LandingShowcase } from "@/components/modules/landing/landing-showcase";
import { LandingComparison } from "@/components/modules/landing/landing-comparison";
import { LandingFAQ } from "@/components/modules/landing/landing-faq";
import { LandingCTA } from "@/components/modules/landing/landing-cta";
import { LandingFooter } from "@/components/modules/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <LandingHeader />
      <LandingHero />
      <LandingTrust />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingShowcase />
      <LandingComparison />
      <LandingFAQ />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
