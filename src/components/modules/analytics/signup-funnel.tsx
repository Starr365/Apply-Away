"use client";

import { Filter, ArrowRight } from "lucide-react";

interface SignupFunnelProps {
  funnel: {
    visitors: number;
    signups: number;
    activatedUsers: number;
    visitorToSignup: number;
    signupToActivation: number;
  };
}

export function SignupFunnel({ funnel }: SignupFunnelProps) {
  const steps = [
    {
      label: "Visitors",
      count: funnel.visitors,
      convRate: null,
      color: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    },
    {
      label: "Sign-ups",
      count: funnel.signups,
      convRate: `${funnel.visitorToSignup}% conversion`,
      color: "bg-primary/20 text-primary border-primary/30",
    },
    {
      label: "Activated Users",
      count: funnel.activatedUsers,
      convRate: `${funnel.signupToActivation}% activation`,
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
  ];

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-border/80 shadow-md space-y-4">
      <div className="flex items-center space-x-2 border-b border-border pb-3">
        <Filter className="w-4 h-4 text-sky-400" />
        <div>
          <h3 className="text-base font-bold font-outfit text-foreground">Sign-up & Product Activation Funnel</h3>
          <p className="text-xs text-muted-foreground">Drop-off pipeline from website visit to saving first opportunity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {steps.map((step, idx) => (
          <div key={step.label} className="relative flex flex-col items-center">
            <div className={`w-full p-4 rounded-2xl border flex flex-col items-center justify-center space-y-1 ${step.color}`}>
              <span className="text-xs font-bold uppercase tracking-wider">{step.label}</span>
              <span className="text-2xl font-black font-outfit text-foreground">{step.count.toLocaleString()}</span>
              {step.convRate && (
                <span className="text-[11px] font-bold bg-background/60 px-2 py-0.5 rounded-full border border-border">
                  {step.convRate}
                </span>
              )}
            </div>

            {idx < steps.length - 1 && (
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-card border border-border items-center justify-center text-muted-foreground">
                <ArrowRight className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
