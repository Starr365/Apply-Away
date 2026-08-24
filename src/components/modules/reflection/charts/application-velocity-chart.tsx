"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface VelocityDataPoint {
  period: string;
  total: number;
  submitted: number;
}

interface ApplicationVelocityChartProps {
  data: VelocityDataPoint[];
}

export function ApplicationVelocityChart({ data }: ApplicationVelocityChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500">
        No application history recorded yet.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.4)" />
          <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "rgba(51, 65, 85, 0.8)",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "12px",
            }}
          />

          <Area
            type="monotone"
            dataKey="total"
            name="Created"
            stroke="#8b5cf6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTotal)"
          />
          <Area
            type="monotone"
            dataKey="submitted"
            name="Submitted"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSubmitted)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
