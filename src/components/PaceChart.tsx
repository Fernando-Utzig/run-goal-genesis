
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface PaceChartProps {
  data: Array<{
    date: string;
    pace: number;
  }>;
}

export function PaceChart({ data }: PaceChartProps) {
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
            tickFormatter={(value) => `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`}
          />
          <Tooltip 
            formatter={(value: number) => [
              `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')} min/km`,
              "Pace"
            ]}
          />
          <Line
            type="monotone"
            dataKey="pace"
            stroke="#16a34a"
            strokeWidth={2}
            dot={{ fill: "#16a34a" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
