"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatedContainer } from "@/components/ui/animated-container";

const FAQS = [
  {
    q: "What is Apply Away?",
    a: "Apply Away is your personal opportunity management workspace. It helps you save scholarships, fellowships, internships, grants, jobs, conferences, research programs, and other opportunities in one place. Instead of keeping application links across WhatsApp, bookmarks, notes, screenshots, and random documents, Apply Away helps you organize everything, track deadlines, and stay on top of your applications.",
  },
  {
    q: "How does the AI opportunity extraction work?",
    a: "Simply paste an opportunity URL or the text you've copied from an opportunity announcement. Apply Away's AI analyzes the information and extracts the important details, such as opportunity name, organization, type, deadline, eligibility, requirements, benefits, location, funding info, and important notes. The AI does the organizing—you stay in control.",
  },
  {
    q: "Can I add opportunities from WhatsApp?",
    a: "Yes. If you receive an opportunity announcement through WhatsApp, Telegram, email, or anywhere else, simply copy the relevant text and paste it into Apply Away. You can also paste the original opportunity link when one is available. The goal is to make capturing an opportunity take seconds instead of minutes.",
  },
  {
    q: "Will Apply Away automatically apply for me?",
    a: "No—and intentionally so. Apply Away helps you discover, organize, prepare for, and track opportunities. It does not submit applications on your behalf. You remain in control of your applications and can review every extracted detail before deciding whether to apply.",
  },
  {
    q: "How do deadline reminders work?",
    a: "Apply Away keeps track of your opportunity deadlines and sends reminders before they expire (e.g. 3 days before, 2 days before, 1 day before, 24 hours before, and 12 hours before). The system converts UTC deadlines into your local timezone (like West Africa Time) so you know exactly when your application is due.",
  },
  {
    q: "What happens when an opportunity has a different timezone?",
    a: "Apply Away handles the conversion for you automatically. The original deadline and timezone are preserved, while the deadline is displayed in your preferred local timezone. This prevents one of the worst application mistakes: thinking you still have time when the opportunity has already closed.",
  },
  {
    q: "Can I edit information extracted by the AI?",
    a: "Absolutely. AI extraction is designed to save you time; not make decisions for you. You can review, correct, add, or remove any information before or after saving an opportunity.",
  },
  {
    q: "Is my application data private?",
    a: "Your opportunities and application data are associated strictly with your account. Other users cannot access your opportunities, notes, activity logs, reflections, or application information. Apply Away is designed with user-level data isolation from the beginning so that each user's data remains separate.",
  },
  {
    q: "Is Apply Away free?",
    a: "For the MVP, Apply Away is being developed as a personal application. Future pricing will be announced when the platform is opened to more users.",
  },
];

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-16">
        {/* Header Block */}
        <AnimatedContainer delay={100} className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs sm:text-sm font-bold text-primary uppercase tracking-widest select-none">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground leading-tight">
            Everything you need to know about Apply Away
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground select-none">
            Have a question? We&apos;re here to help.
          </p>
        </AnimatedContainer>

        {/* FAQs Accordions */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <AnimatedContainer
                key={idx}
                delay={150 + idx * 40}
                className="bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  type="button"
                  className="w-full py-4 px-6 flex items-center justify-between text-left font-bold font-outfit text-base sm:text-lg text-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-60 border-t border-border/60" : "max-h-0"
                    }`}
                >
                  {isOpen && (
                    <p className="p-5 text-xs sm:text-base text-muted-foreground leading-relaxed text-left">
                      {faq.a}
                    </p>
                  )}
                </div>
              </AnimatedContainer>
            );
          })}
        </div>
      </div>
    </section>
  );
}
