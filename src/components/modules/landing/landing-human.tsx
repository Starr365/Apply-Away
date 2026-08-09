"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function LandingHuman() {
  return (
    <section className="py-24 bg-card/40 border-t border-border/60 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Real Stock Photo: University students working on laptops in a library/study cafe */}
          <AnimatedContainer delay={100} className="lg:col-span-6 relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[400px] border border-border shadow-2xl group">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
              alt="Diverse university students collaborating with laptops in a university study library"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent p-6 flex flex-col justify-end">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Built for Opportunity Hunters
              </span>
            </div>
          </AnimatedContainer>

          {/* Right Editorial Copy & CTA */}
          <AnimatedContainer delay={200} className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              FOR AMBITIOUS LEARNERS & BUILDERS
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-foreground tracking-tight leading-snug">
              For people who are always looking for what's next.
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Because the next opportunity shouldn't depend on how good you are at keeping 27 browser tabs open.
            </p>

            <div className="pt-2">
              <Link href="/auth">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-extrabold text-slate-950 px-8"
                >
                  Save My Next Opportunity
                </Button>
              </Link>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
}
