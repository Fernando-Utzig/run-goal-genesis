
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DistanceChartProps {
  data: Array<{
    date: string;
    distance: number;
  }>;
}

export function DistanceChart({ data }: DistanceChartProps) {
  console.log('DistanceChart data:', data);

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
            tickFormatter={(value) => `${value}km`}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="distance"
            stroke="#007bff"
            strokeWidth={2}
            dot={{ fill: "#007bff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
