
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLine, Speedometer, Clock } from "lucide-react";
import { KPICard } from "./KPICard";
import { DistanceChart } from "./DistanceChart";
import { SpeedChart } from "./SpeedChart";
import { PaceChart } from "./PaceChart";
import { useDashboardData } from "@/hooks/useDashboardData";

export function Dashboard() {
  const { data: runs = [], isLoading } = useDashboardData('user-1');

  // Calculate KPIs
  const totalDistance = runs.reduce((sum, run) => sum + run.distance, 0);
  const totalRuns = runs.length;
  
  // Calculate average pace (in seconds per kilometer)
  const totalPace = runs.reduce((sum, run) => sum + (run.duration / run.distance), 0);
  const averagePace = runs.length > 0 ? totalPace / runs.length : 0;
  
  // Prepare chart data
  const chartData = runs.map(run => {
    const date = new Date(run.date).toLocaleDateString();
    const speed = (run.distance / (run.duration / 3600)).toFixed(1); // km/h
    const pace = Math.round(run.duration / run.distance); // seconds per km
    
    return {
      date,
      distance: run.distance,
      speed: parseFloat(speed),
      pace
    };
  });

  return (
    <div className="p-6 bg-[#F0F0F0] rounded-lg space-y-6">
      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Total Distance"
          value={`${totalDistance.toFixed(1)} km`}
          icon={ChartLine}
          description="This Month"
        />
        <KPICard
          title="Average Pace"
          value={`${Math.floor(averagePace / 60)}:${(Math.round(averagePace) % 60).toString().padStart(2, '0')} /km`}
          icon={Clock}
          description="This Month"
        />
        <KPICard
          title="Total Runs"
          value={totalRuns.toString()}
          icon={Speedometer}
          description="This Month"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Distance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <DistanceChart data={chartData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Speed Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <SpeedChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pace Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <PaceChart data={chartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
