"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface TrafficChartProps {
  data: {
    date: string;
    visitors: number;
    newVisitors: number;
    returningVisitors: number;
  }[];
}

export function TrafficChart({ data }: TrafficChartProps) {
  const [activeMetric, setActiveMetric] = useState<"visitors" | "newVisitors" | "returningVisitors">("visitors");

  const metricConfig = {
    visitors: { label: "Total Visitors", stroke: "#38bdf8", fill: "#38bdf8" },
    newVisitors: { label: "New Visitors", stroke: "#10b981", fill: "#10b981" },
    returningVisitors: { label: "Returning Visitors", stroke: "#a855f7", fill: "#a855f7" },
  };

  const config = metricConfig[activeMetric];

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-border/80 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold font-outfit text-foreground">Website Traffic</h3>
          <p className="text-xs text-muted-foreground">Unique sessions and visitor behavior over time.</p>
        </div>

        <div className="flex items-center space-x-1 bg-secondary/80 border border-border p-1 rounded-xl text-xs">
          {(["visitors", "newVisitors", "returningVisitors"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveMetric(key)}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeMetric === key
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {key === "visitors" ? "Total" : key === "newVisitors" ? "New" : "Returning"}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-2">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
            No visitor traffic recorded for this date range.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.fill} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={config.fill} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                tickFormatter={(str) => str.slice(5)}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "var(--foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey={activeMetric}
                name={config.label}
                stroke={config.stroke}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#trafficGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
