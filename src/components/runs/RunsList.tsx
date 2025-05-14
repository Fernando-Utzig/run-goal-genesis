
import { RunData } from '@/types/run';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface RunsListProps {
  runs: RunData[];
  loading: boolean;
  onDeleteRun: (runId: string) => Promise<void>;
}

export function RunsList({ runs, loading, onDeleteRun }: RunsListProps) {
  const formatPace = (paceInSeconds: number): string => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Runs</CardTitle>
        <CardDescription>Complete a run to trigger automatic goal generation</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading runs...</p>
        ) : runs.length === 0 ? (
          <p className="text-muted-foreground">No runs yet</p>
        ) : (
          <ul className="space-y-2">
            {runs.map(run => (
              <li key={run.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex justify-between">
                      <span className="font-medium">{new Date(run.date).toLocaleDateString()}</span>
                      <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full ml-2">
                        {run.status}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Distance</p>
                        <p>{run.distance.toFixed(2)} km</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Pace</p>
                        <p>{formatPace(run.duration / run.distance)}/km</p>
                      </div>
                    </div>
                    {(run.city || run.state) && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm">{run.city && run.state ? `${run.city}, ${run.state}` : (run.city || run.state)}</p>
                      </div>
                    )}
                    {run.notes && (
                      <p className="mt-2 text-sm text-gray-600">{run.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteRun(run.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
