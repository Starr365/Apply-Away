"use client";

import { Sparkles, CheckCircle2, AlertTriangle, Compass } from "lucide-react";

interface OwnerReflectionProps {
  reflection: {
    whatsWorking: string;
    whatsNeedsAttention: string;
    nextDecision: string;
  };
}

export function OwnerReflection({ reflection }: OwnerReflectionProps) {
  const cards = [
    {
      title: "WHAT'S WORKING",
      text: reflection.whatsWorking,
      icon: CheckCircle2,
      color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-500",
    },
    {
      title: "WHAT NEEDS ATTENTION",
      text: reflection.whatsNeedsAttention,
      icon: AlertTriangle,
      color: "border-amber-500/30 bg-amber-500/5 text-amber-500",
    },
    {
      title: "NEXT DECISION",
      text: reflection.nextDecision,
      icon: Compass,
      color: "border-sky-500/30 bg-sky-500/5 text-sky-500",
    },
  ];

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-border/80 shadow-md space-y-4">
      <div className="flex items-center space-x-2 border-b border-border pb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <div>
          <h3 className="text-base font-bold font-outfit text-foreground">Your Growth Reflection</h3>
          <p className="text-xs text-muted-foreground">Actionable owner insights to convert data into marketing decisions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className={`p-4 rounded-2xl border space-y-2 ${c.color}`}>
              <div className="flex items-center space-x-1.5 text-xs font-black tracking-wider uppercase">
                <Icon className="w-4 h-4" />
                <span>{c.title}</span>
              </div>
              <p className="text-xs font-medium text-foreground leading-relaxed">{c.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
