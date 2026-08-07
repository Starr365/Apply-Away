"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
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

      let backgroundColor = "#8b5cf6"; // Purple default
      let borderColor = "#a855f7";

      if (opp.status === "SUBMITTED" || opp.status === "ACCEPTED") {
        backgroundColor = "#10b981"; // Emerald
        borderColor = "#34d399";
      } else if (isOverdue || opp.priority === "HIGH") {
        backgroundColor = "#f43f5e"; // Rose
        borderColor = "#fb7185";
      } else if (opp.priority === "MEDIUM") {
        backgroundColor = "#f59e0b"; // Amber
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
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-white font-outfit text-sm">Deadline Calendar</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>High Priority / Due Soon</span>
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
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Standard Deadline</span>
          </div>
        </div>
      </div>

      {/* FullCalendar Widget Container */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl">
        <div className="fullcalendar-dark-theme">
          <FullCalendar
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            plugins={[dayGridPlugin as any, interactionPlugin as any]}
            initialView="dayGridMonth"
            events={calendarEvents}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            height="auto"
            aspectRatio={1.5}
          />
        </div>
      </div>

      {/* Quick View Opportunity Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 space-y-5 border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-purple-400 font-semibold">
                  <Building className="w-3.5 h-3.5" />
                  <span>{selectedOpportunity.organization}</span>
                </div>
                <h3 className="text-lg font-bold font-outfit text-white">
                  {selectedOpportunity.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOpportunity(null)}
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
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
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>
                  Deadline: <strong>{formatDate(selectedOpportunity.deadline)}</strong>
                </span>
              </div>
              <span className="font-semibold text-purple-300">
                {getDaysRemaining(selectedOpportunity.deadline).label}
              </span>
            </div>

            {selectedOpportunity.shortDescription && (
              <p className="text-xs text-slate-400 line-clamp-3">
                {selectedOpportunity.shortDescription}
              </p>
            )}

            {/* Actions */}
            <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
              {selectedOpportunity.officialUrl ? (
                <a
                  href={selectedOpportunity.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                >
                  <span>Official Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <div />
              )}

              <Link
                href={`/opportunities/${selectedOpportunity.id}`}
                className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center space-x-1.5 transition-all shadow-md shadow-purple-600/20"
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
