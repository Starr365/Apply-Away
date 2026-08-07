"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is this a career search platform?",
    a: "No. Apply Away is a private, personal opportunity vault. You collect and track the fellowships, jobs, or grants you care about. We provide the AI organization, calendar layout, and reminder automation.",
  },
  {
    q: "How does the AI capture work?",
    a: "Simply paste a webpage link or block of raw copy text. Our system parses the opportunity sponsor, name, guidelines, URLs, and exact deadline time to build your vault profile dynamically.",
  },
  {
    q: "How are reminders dispatched?",
    a: "We execute a centralized cron service. Based on your account's selected local timezone, the service schedules emails to notify you at fixed windows (e.g., 7 days or 24 hours before submission).",
  },
];

export function LandingFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">Any Questions?</div>
          <h2 className="text-3xl font-bold font-outfit text-white">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Everything you need to know about the Apply Away opportunity management engine.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl overflow-hidden border border-border/80 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  type="button"
                  className="w-full p-5 flex items-center justify-between text-left font-bold font-outfit text-sm text-white hover:bg-slate-900/40 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-48 border-t border-border/50" : "max-h-0"
                  }`}
                >
                  <p className="p-5 text-xs text-muted-foreground leading-relaxed text-left">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
