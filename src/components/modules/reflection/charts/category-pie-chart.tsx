"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface CategoryDataPoint {
  name: string;
  value: number;
}

interface CategoryPieChartProps {
  data: CategoryDataPoint[];
}

const COLORS = [
  "#38bdf8", // Deep Sky Blue (Fellowship / Primary)
  "#10b981", // Emerald (Scholarship)
  "#0284c7", // Sky (Internship)
  "#f59e0b", // Amber (Job)
  "#ec4899", // Pink (Grant)
  "#f97316", // Orange (Competition)
  "#14b8a6", // Teal (Research)
  "#6366f1", // Indigo (Conference)
];

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500">
        No category distribution data available.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#0f172a" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "rgba(51, 65, 85, 0.8)",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "12px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
