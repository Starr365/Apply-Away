"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";

interface StatusDataPoint {
  status: string;
  count: number;
}

interface StatusConversionChartProps {
  data: StatusDataPoint[];
}

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "#64748b",
  "In Progress": "#0284c7",
  Submitted: "#8b5cf6",
  Interview: "#f59e0b",
  Accepted: "#10b981",
  Rejected: "#f43f5e",
};

export function StatusConversionChart({ data }: StatusConversionChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500">
        No status pipeline data available.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.4)" />
          <XAxis dataKey="status" stroke="#94a3b8" fontSize={11} tickLine={false} />
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

          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.status] || "#8b5cf6"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
