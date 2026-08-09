"use client";

import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Wand2, CheckCircle2, ArrowRight, Sparkles, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingSave() {
  const [pastedText, setPastedText] = useState(
    "Commonwealth Master's Scholarships 2026 for developing Commonwealth country students. Full tuition fee waiver, monthly stipend of £1,347, flight fare, and arrival allowance. Deadline: 17 October 2026 at 16:00 BST. Apply online at cscuk.fcdo.gov.uk"
  );
  const [isExtracting, setIsExtracting] = useState(false);
  const [extracted, setExtracted] = useState(false);

  // React-spring animation for extracted card reveal
  const springStyles = useSpring({
    opacity: extracted ? 1 : 0,
    transform: extracted ? "scale(1) translateY(0px)" : "scale(0.95) translateY(10px)",
    config: { tension: 280, friction: 24 },
  });

  const handleExtractClick = () => {
    setIsExtracting(true);
    setExtracted(false);
    setTimeout(() => {
      setIsExtracting(false);
      setExtracted(true);
    }, 1200);
  };

  return (
    <section id="features" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <AnimatedContainer delay={100} className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            INSTANT SAVE & CAPTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-foreground tracking-tight">
            Found an opportunity? <br />
            Save it before it disappears.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Copy any website link or raw announcement text, paste it into Apply Away, and let AI structure the deadlines, requirements, and eligibility in seconds.
          </p>
        </AnimatedContainer>

        {/* Interactive AI Extraction Demo Showcase */}
        <AnimatedContainer delay={200} className="max-w-4xl mx-auto">
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center space-x-2 text-xs font-bold text-foreground">
                <Copy className="w-4 h-4 text-primary" />
                <span>Paste Opportunity URL or Announcement Text</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                Interactive Demo
              </span>
            </div>

            {/* Input Text Area */}
            <div className="space-y-3">
              <textarea
                rows={4}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste opportunity URL or copied text..."
                className="w-full p-4 rounded-2xl bg-background border border-input text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-sans"
              />

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleExtractClick}
                  isLoading={isExtracting}
                  leftIcon={<Wand2 className="w-4 h-4" />}
                >
                  {isExtracting ? "Extracting Details..." : "Extract Opportunity →"}
                </Button>
              </div>
            </div>

            {/* Extracted Card Output with Spring Animation */}
            {extracted && (
              <animated.div style={springStyles} className="pt-2">
                <div className="p-5 rounded-2xl bg-primary/10 border border-primary/30 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-primary/20">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-primary text-slate-950 text-[10px] font-bold uppercase">
                          SCHOLARSHIP
                        </span>
                        <h4 className="text-base font-bold font-outfit text-foreground">
                          Commonwealth Master's Scholarships 2026
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Commonwealth Scholarship Commission (CSC UK)
                      </p>
                    </div>

                    <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      Deadline: Oct 17 · 4:00 PM WAT
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-foreground">
                    <div className="space-y-1">
                      <span className="font-bold text-primary block">Eligibility</span>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Developing Commonwealth country citizens; holding first degree of second-class upper standard.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-primary block">Benefits</span>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Full tuition fee waiver, monthly stipend of £1,347, airfare, and arrival allowance.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs border-t border-primary/20">
                    <span className="text-emerald-500 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ready to save to your Opportunity Vault</span>
                    </span>

                    <span className="text-[11px] text-muted-foreground">
                      Timezone auto-converted to WAT
                    </span>
                  </div>
                </div>
              </animated.div>
            )}
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
