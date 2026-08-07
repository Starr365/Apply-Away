"use client";

import React from "react";

const TRUST_LOGOS = ["Cisco", "Adobe", "Slack", "Google", "Spotify"];

export function LandingTrust() {
  return (
    <section className="py-12 border-t border-b border-border/60 bg-card/20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <span className="text-xs font-semibold text-muted-foreground tracking-wide select-none text-center sm:text-left">
          Trusted by ambitious students and researchers worldwide
        </span>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {TRUST_LOGOS.map((name) => (
            <span
              key={name}
              className="text-sm font-extrabold tracking-widest text-muted-foreground/60 select-none cursor-default hover:text-muted-foreground transition-colors font-outfit"
            >
              {name.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
