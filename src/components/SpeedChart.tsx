
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SpeedChartProps {
  data: Array<{
    date: string;
    speed: number;
  }>;
}

export function SpeedChart({ data }: SpeedChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toFixed(1)} km/h`}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="speed"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: "#2563eb" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
