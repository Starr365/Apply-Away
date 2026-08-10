"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      
      <AnimatedContainer
        delay={150}
        className="max-w-4xl mx-auto bg-card border border-border p-8 sm:p-14 rounded-3xl text-center space-y-6 relative z-10 shadow-2xl"
      >
        <div className="inline-flex w-20 h-20 rounded-3xl bg-card border border-border items-center justify-center shadow-xl select-none relative mx-auto">
          <Image src="/vault-logo.png" alt="Apply Away Vault" fill sizes="64px" className="object-contain p-3" />
        </div>
        
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-outfit text-foreground max-w-3xl mx-auto leading-tight">
          Your next opportunity is probably already somewhere in your phone. <br />
          <span className="text-primary font-bold">Don&apos;t lose it. Save it to Apply Away.</span>
        </h2>

        <div className="pt-2 flex flex-col items-center justify-center space-y-3">
          <Link href="/auth">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-extrabold text-slate-950 px-8"
            >
              Build My Opportunity Vault
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground">
            Free to start · Built for opportunity hunters
          </span>
        </div>
      </AnimatedContainer>
    </section>
  );
}
