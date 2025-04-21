
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { date: "2024-04-01", distance: 5 },
  { date: "2024-04-03", distance: 3 },
  { date: "2024-04-05", distance: 7 },
  { date: "2024-04-07", distance: 4 },
  { date: "2024-04-09", distance: 6 },
  { date: "2024-04-11", distance: 8 },
  { date: "2024-04-13", distance: 5 },
].map(item => ({
  ...item,
  date: new Date(item.date).toLocaleDateString(),
}));

export function DistanceChart() {
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
