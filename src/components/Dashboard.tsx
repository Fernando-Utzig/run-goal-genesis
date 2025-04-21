
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, ChartLine, ChartBar, CalendarDays } from "lucide-react";
import { KPICard } from "./KPICard";
import { DistanceChart } from "./DistanceChart";
import { FrequencyChart } from "./FrequencyChart";

export function Dashboard() {
  // Sample data - In a real app, this would come from your database
  const kpiData = {
    totalDistance: 42.5,
    averagePace: "5:30",
    totalRuns: 8,
    trend: "up" as const
  };

  return (
    <div className="p-6 bg-[#F0F0F0] rounded-lg space-y-6">
      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Total Distance"
          value={`${kpiData.totalDistance} km`}
          icon={ChartLine}
          trend={kpiData.trend}
          description="This Month"
        />
        <KPICard
          title="Average Pace"
          value={`${kpiData.averagePace} min/km`}
          icon={CalendarDays}
          description="This Month"
        />
        <KPICard
          title="Total Runs"
          value={kpiData.totalRuns.toString()}
          icon={ChartBar}
          trend={kpiData.trend}
          description="This Month"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Distance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <DistanceChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Run Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <FrequencyChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
