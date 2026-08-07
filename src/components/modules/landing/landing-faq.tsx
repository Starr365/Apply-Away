"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

// Primary FAQ List (8 Questions)
const PRIMARY_FAQS = [
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
    q: "Can I track my applications and progress?",
    a: "Yes. Each opportunity can have a status that reflects where you are in the application process, such as Not Started → Preparing → Drafting → Reviewing → Submitted → Interview → Accepted / Rejected. You can also add personal notes and view the audit history log for each opportunity.",
  },
  {
    q: "Is my application data private?",
    a: "Your opportunities and application data are associated strictly with your account. Other users cannot access your opportunities, notes, activity logs, reflections, or application information. Apply Away is designed with user-level data isolation from the beginning so that each user's data remains separate.",
  },
];

// Secondary FAQ List (4 Questions)
const SECONDARY_FAQS = [
  {
    q: "Can I see all my deadlines on a calendar?",
    a: "Yes. The Calendar View gives you a visual overview of your upcoming opportunity deadlines. You can quickly identify busy periods, open an opportunity directly from the calendar, and plan your applications before deadlines become urgent.",
  },
  {
    q: "What is the Reflection Dashboard?",
    a: "The Reflection Dashboard helps you look back at your application journey. You can visually see opportunities saved, applications submitted, wins, rejections, opportunity categories, and monthly activity trends, as well as write a monthly reflection about what worked and what you can do better.",
  },
  {
    q: "Can I edit information extracted by the AI?",
    a: "Absolutely. AI extraction is designed to save you time—not make decisions for you. You can review, correct, add, or remove any information before or after saving an opportunity.",
  },
  {
    q: "Is Apply Away free?",
    a: "For the MVP, Apply Away is being developed as a personal application. Future pricing will be announced when the platform is opened to more users.",
  },
];

export function LandingFAQ() {
  const [openPrimary, setOpenPrimary] = useState<number | null>(null);
  const [openSecondary, setOpenSecondary] = useState<number | null>(null);
  const [showMore, setShowMore] = useState(false);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-16">

        {/* Header Block */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-widest select-none">
            Common Inquiries
          </div>
          <h2 className="text-3xl font-bold font-outfit text-white leading-tight">
            Got questions? We&apos;ve got answers.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground select-none">
            Before your next application, you might be wondering…
          </p>
        </div>

        {/* Primary FAQs */}
        <div className="space-y-4">
          {PRIMARY_FAQS.map((faq, idx) => {
            const isOpen = openPrimary === idx;
            return (
              <div
                key={`primary-${idx}`}
                className="glass-card rounded-2xl overflow-hidden border border-border/80 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenPrimary(isOpen ? null : idx)}
                  type="button"
                  className="w-full p-5 flex items-center justify-between text-left font-bold font-outfit text-sm text-white hover:bg-slate-900/40 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-60 border-t border-border/50" : "max-h-0"
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

        {/* Show More Trigger Button */}
        <div className="text-center pt-2">
          <button
            onClick={() => setShowMore((prev) => !prev)}
            type="button"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-border hover:border-purple-500/30 bg-card/40 hover:bg-card text-xs font-bold text-white transition-all cursor-pointer"
          >
            <span>{showMore ? "Show fewer questions" : "More questions"}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-purple-400 transition-transform duration-300 ${showMore ? "rotate-180" : ""
                }`}
            />
          </button>
        </div>

        {/* Secondary FAQs (Hidden by default) */}
        {showMore && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {SECONDARY_FAQS.map((faq, idx) => {
              const isOpen = openSecondary === idx;
              return (
                <div
                  key={`secondary-${idx}`}
                  className="glass-card rounded-2xl overflow-hidden border border-border/80 transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenSecondary(isOpen ? null : idx)}
                    type="button"
                    className="w-full p-5 flex items-center justify-between text-left font-bold font-outfit text-sm text-white hover:bg-slate-900/40 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-purple-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-60 border-t border-border/50" : "max-h-0"
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
        )}

      </div>
    </section>
  );
}
