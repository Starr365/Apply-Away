"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const CalendarRenderer = dynamic(() => import("./calendar-renderer"), {
  ssr: false,
  loading: () => <Skeleton className="h-125 w-full rounded-3xl animate-pulse" />,
});

import { Opportunity } from "@/domain/opportunity.types";
import { CategoryBadge, StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import { Calendar as CalendarIcon, ExternalLink, X, ArrowRight, Building, Clock } from "lucide-react";
import Link from "next/link";

interface CalendarViewProps {
  opportunities: Opportunity[];
}

export function CalendarView({ opportunities }: CalendarViewProps) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Map opportunities into FullCalendar Event objects
  const nowTime = new Date().getTime();

  const calendarEvents = opportunities
    .filter((opp) => opp.deadline)
    .map((opp) => {
      const deadlineDate = new Date(opp.deadline!);
      const isOverdue = deadlineDate.getTime() < nowTime;

      let backgroundColor = "#38bdf8";
      let borderColor = "#7dd3fc";

      if (opp.status === "SUBMITTED" || opp.status === "ACCEPTED") {
        backgroundColor = "#10b981";
        borderColor = "#34d399";
      } else if (isOverdue && opp.status !== "REJECTED") {
        backgroundColor = "#f97316"; // Orange for Missed Deadlines
        borderColor = "#fb923c";
      } else if (opp.priority === "HIGH") {
        backgroundColor = "#ef4444"; // Red for High Priority
        borderColor = "#f87171";
      } else if (opp.priority === "MEDIUM") {
        backgroundColor = "#f59e0b"; // Amber for Medium Priority
        borderColor = "#fbbf24";
      }

      return {
        id: opp.id,
        title: `${opp.organization}: ${opp.title}`,
        start: deadlineDate.toISOString().split("T")[0],
        backgroundColor,
        borderColor,
        textColor: "#ffffff",
        extendedProps: { opportunity: opp },
      };
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEventClick = (info: any) => {
    if (info.jsEvent) {
      info.jsEvent.preventDefault();
    }
    const opp = info.event?.extendedProps?.opportunity as Opportunity;
    if (opp) {
      setSelectedOpportunity(opp);
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Legend */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-primary" />
          <span className="font-bold text-foreground font-outfit text-sm">Deadline Calendar</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Missed Deadline</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>High Priority</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Submitted / Accepted</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span>Standard Deadline</span>
          </div>
        </div>
      </div>

      {/* FullCalendar Widget Container */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl overflow-hidden border border-border shadow-2xl">
        <CalendarRenderer events={calendarEvents} onEventClick={handleEventClick} />
      </div>

      {/* Quick View Opportunity Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 space-y-5 border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-primary font-semibold">
                  <Building className="w-3.5 h-3.5" />
                  <span>{selectedOpportunity.organization}</span>
                </div>
                <h3 className="text-lg font-bold font-outfit text-foreground">
                  {selectedOpportunity.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOpportunity(null)}
                className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={selectedOpportunity.category} />
              <StatusBadge status={selectedOpportunity.status} />
              <PriorityBadge priority={selectedOpportunity.priority} />
            </div>

            {/* Deadline info */}
            <div className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between text-xs text-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>
                  Deadline: <strong>{formatDate(selectedOpportunity.deadline)}</strong>
                </span>
              </div>
              <span className="font-semibold text-primary">
                {getDaysRemaining(selectedOpportunity.deadline).label}
              </span>
            </div>

            {selectedOpportunity.shortDescription && (
              <p className="text-xs text-muted-foreground line-clamp-3">
                {selectedOpportunity.shortDescription}
              </p>
            )}

            {/* Actions */}
            <div className="border-t border-border pt-4 flex justify-between items-center">
              {selectedOpportunity.officialUrl ? (
                <a
                  href={selectedOpportunity.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-primary/80 flex items-center space-x-1"
                >
                  <span>Official Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <div />
              )}

              <Link
                href={`/opportunities/${selectedOpportunity.id}`}
                className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold text-primary-foreground flex items-center space-x-1.5 transition-all shadow-md shadow-primary/20"
              >
                <span>Open Full Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
