
import { RunData } from '@/types/run';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

interface AllRunsListProps {
  runs: RunData[];
  loading: boolean;
  onDeleteRun?: (runId: string) => Promise<void>;
}

export function AllRunsList({ runs, loading, onDeleteRun }: AllRunsListProps) {
  const formatPace = (paceInSeconds: number): string => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All User Runs</CardTitle>
        <CardDescription>View runs from all users in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading runs...</p>
        ) : runs.length === 0 ? (
          <p className="text-muted-foreground">No runs found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Distance (km)</TableHead>
                  <TableHead>Pace</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  {onDeleteRun && <TableHead className="w-[80px]">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map(run => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">{run.userId}</TableCell>
                    <TableCell>{new Date(run.date).toLocaleDateString()}</TableCell>
                    <TableCell>{run.distance.toFixed(2)}</TableCell>
                    <TableCell>{formatPace(run.duration / run.distance)}/km</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {run.status}
                      </span>
                    </TableCell>
                    <TableCell>{run.notes || "-"}</TableCell>
                    {onDeleteRun && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDeleteRun(run.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
