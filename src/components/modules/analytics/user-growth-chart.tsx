"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface UserGrowthChartProps {
  growth: {
    date: string;
    newUsers: number;
    totalUsers: number;
  }[];
}

export function UserGrowthChart({ growth }: UserGrowthChartProps) {
  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-border/80 shadow-md space-y-4">
      <div className="flex items-center space-x-2 border-b border-border pb-3">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <div>
          <h3 className="text-base font-bold font-outfit text-foreground">User Growth Velocity</h3>
          <p className="text-xs text-muted-foreground">New sign-ups vs cumulative registered user base.</p>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        {growth.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
            No user signups recorded in this date range.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickFormatter={(s) => s.slice(5)} />
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
              <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="totalUsers" name="Total Users" stroke="#10b981" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
