"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function LandingCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Colorful Glow Backgrounds */}
      <div className="absolute inset-0 bg-linear-to-r from-purple-900/10 via-indigo-900/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto glass-panel p-8 sm:p-16 rounded-3xl text-center space-y-6 relative z-10 border border-purple-500/25 shadow-2xl">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-500 items-center justify-center shadow-lg shadow-purple-500/25 select-none">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-outfit text-white">
          Your next opportunity could change your life. <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400 font-bold">
            Start organizing today.
          </span>
        </h2>
        
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Create your account today and experience structured AI opportunity organization. Free to get started, no credit card required.
        </p>

        <div className="pt-4 flex justify-center">
          <Link
            href="/login"
            className="h-12 px-8 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-bold text-white shadow-lg shadow-purple-600/30 flex items-center space-x-2 transition-all group"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
