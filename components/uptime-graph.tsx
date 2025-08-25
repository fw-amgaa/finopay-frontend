"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

interface ChartDataPoint {
  time: string;
  status: number; // 0 or 1
  rawStatus: "good" | "bad";
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    name: string;
    payload: ChartDataPoint;
  }>;
  label?: string;
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: ChartDataPoint;
  value?: number;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const status = payload[0].value === 1 ? "Up" : "Down";
    const statusColor = payload[0].value === 1 ? "#10b981" : "#ef4444";

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600 mb-1">{`Time: ${label}`}</p>
        <p className="text-sm font-medium" style={{ color: statusColor }}>
          {`Status: ${status}`}
        </p>
      </div>
    );
  }
  return null;
};

const CustomDot: React.FC<CustomDotProps> = ({ cx, cy, payload }) => {
  if (!cx || !cy || !payload) return null;

  const color = payload.status === 1 ? "#10b981" : "#ef4444";
  return (
    <circle cx={cx} cy={cy} r={3} fill={color} stroke={color} strokeWidth={2} />
  );
};

export default function UptimeGraph() {
  const data = useQuery(api.healthCheck.recent) ?? [];

  const chartData = data
    .map((d) => ({
      time: new Date(d.timestamp).toLocaleTimeString(),
      status: d.status === "good" ? 1 : 0,
    }))
    .reverse();

  console.log("chartData", chartData);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Hyperswitch Server Uptime</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Shows connection health over the last 100 health checks.
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4">
        <ResponsiveContainer className={"pr-6"} width="100%" height={200}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis
              dataKey="time"
              fontSize={12}
              tick={{ fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={{ stroke: "#e2e8f0" }}
            />

            <YAxis
              fontSize={12}
              domain={[-0.1, 1.1]}
              ticks={[0, 1]}
              tick={{ fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={{ stroke: "#e2e8f0" }}
              tickFormatter={(v) => (v ? "Up" : "Down")}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="stepAfter"
              dataKey="status"
              strokeWidth={1}
              dot={<CustomDot />}
              activeDot={{
                r: 6,
                fill: "#3b82f6",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
