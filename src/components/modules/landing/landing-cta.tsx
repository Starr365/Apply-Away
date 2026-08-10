"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <AnimatedContainer
        delay={150}
        className="w-full mx-auto bg-primary border border-border p-8 sm:p-14 rounded-3xl text-center space-y-6 relative z-10 shadow-2xl"
      >
        <div className="inline-flex w-20 h-20 rounded-3xl bg-primary-foreground/10 border border-primary-foreground/20 items-center justify-center shadow-xl select-none relative mx-auto">
          <Image src="/vault-logo.png" alt="Apply Away Vault" fill sizes="64px" className="object-contain p-3 dark:brightness-0 dark:invert" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-outfit text-primary-foreground max-w-3xl mx-auto leading-tight">
          Your next opportunity is probably already somewhere in your phone. <br />
          <span className="text-primary-foreground font-black decoration-primary-foreground/30">
            Don&apos;t lose it. Save it to Apply Away!!!
          </span>
        </h2>

        <div className="pt-2 flex flex-col items-center justify-center space-y-3">
          <Link href="/auth">
            <Button
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-extrabold px-8 sm:px-10 h-12 text-sm sm:text-base shadow-xl"
            >
              Build My Opportunity Vault
            </Button>
          </Link>
          <span className="text-xs sm:text-sm font-semibold text-primary-foreground/80">
            Free to start · Built for opportunity hunters
          </span>
        </div>
      </AnimatedContainer>
    </section>
  );
}
