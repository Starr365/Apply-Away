"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

interface CalendarRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEventClick: (info: any) => void;
}

export default function CalendarRenderer({ events, onEventClick }: CalendarRendererProps) {
  const plugins = [
    (dayGridPlugin as any).default || dayGridPlugin,
    (interactionPlugin as any).default || interactionPlugin,
  ];

  return (
    <div className="fullcalendar-dark-theme">
      <FullCalendar
        plugins={plugins}
        initialView="dayGridMonth"
        events={events}
        eventClick={onEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        height="auto"
        aspectRatio={1.5}
      />
    </div>
  );
}
