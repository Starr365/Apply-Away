"use client";

import { MetricWithComparison } from "@/services/admin-analytics.service";
import { Users, UserCheck, Layers, Eye, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface PrimaryKPICardsProps {
  kpis: {
    visitors: MetricWithComparison;
    signups: MetricWithComparison;
    activatedUsers: MetricWithComparison;
    opportunitiesSaved: MetricWithComparison;
  };
}

export function PrimaryKPICards({ kpis }: PrimaryKPICardsProps) {
  const cards = [
    {
      label: "Visitors",
      metric: kpis.visitors,
      icon: Eye,
      colorClass: "text-sky-500 bg-sky-500/10 border-sky-500/20",
    },
    {
      label: "Sign-ups",
      metric: kpis.signups,
      icon: Users,
      colorClass: "text-primary bg-primary/10 border-primary/20",
    },
    {
      label: "Activated Users",
      metric: kpis.activatedUsers,
      icon: UserCheck,
      colorClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      tooltip: "Users who saved at least 1 opportunity",
    },
    {
      label: "Opportunities Saved",
      metric: kpis.opportunitiesSaved,
      icon: Layers,
      colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isUp = card.metric.direction === "up";
        const isDown = card.metric.direction === "down";

        return (
          <div
            key={card.label}
            className="glass-panel p-4 sm:p-5 rounded-2xl border border-border/80 shadow-md space-y-3 transition-transform hover:scale-[1.01]"
            title={card.tooltip}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{card.label}</span>
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${card.colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black font-outfit text-foreground">
                {card.metric.current.toLocaleString()}
              </span>

              <div
                className={`inline-flex items-center space-x-0.5 text-xs font-bold px-2 py-0.5 rounded-full border ${
                  isUp
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : isDown
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    : "bg-secondary text-muted-foreground border-border"
                }`}
              >
                {isUp && <ArrowUpRight className="w-3.5 h-3.5" />}
                {isDown && <ArrowDownRight className="w-3.5 h-3.5" />}
                {!isUp && !isDown && <Minus className="w-3 h-3" />}
                <span>{Math.abs(card.metric.changePercentage)}%</span>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground">
              vs previous period ({card.metric.previous.toLocaleString()})
            </div>
          </div>
        );
      })}
    </div>
  );
}
