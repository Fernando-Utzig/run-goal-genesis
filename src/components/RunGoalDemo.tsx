
import { useState, useEffect } from 'react';
import { RunData } from '@/types/run';
import { GoalData } from '@/types/goal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { completeRun, fetchUserGoals } from '@/services/runGoalService';
import { RunCompletionHandler } from '@/components/RunCompletionHandler';
import { supabase } from '@/lib/supabase';

export function RunGoalDemo() {
  const [userId] = useState('user-1'); // In a real app, this would come from authentication
  const [runs, setRuns] = useState<RunData[]>([]);
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch runs from Supabase
        const { data: runsData, error: runsError } = await supabase
          .from('runs')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });
          
        if (runsError) {
          console.error('Error fetching runs:', runsError);
          return;
        }

        // Fetch goals
        const userGoals = await fetchUserGoals(userId);
        
        // Update state
        setRuns(runsData.map(run => ({
          id: run.id,
          userId: run.user_id,
          date: new Date(run.date),
          distance: run.distance,
          duration: run.duration,
          notes: run.notes,
          status: run.status
        })));
        setGoals(userGoals);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [userId]);

  // Handle completing a run
  const handleCompleteRun = async () => {
    try {
      setLoading(true);
      
      // Create a sample run
      const sampleRun = {
        user_id: userId,
        distance: 5, // 5 km
        duration: 1800, // 30 minutes (in seconds)
        date: new Date().toISOString(),
        status: 'Completed'
      };
      
      // Insert the run into Supabase
      const { data: newRun, error: insertError } = await supabase
        .from('runs')
        .insert([sampleRun])
        .select()
        .single();
        
      if (insertError) {
        console.error('Failed to insert run:', insertError);
        return;
      }
      
      // Update our local state with the new run
      setRuns(prev => [{
        id: newRun.id,
        userId: newRun.user_id,
        date: new Date(newRun.date),
        distance: newRun.distance,
        duration: newRun.duration,
        notes: newRun.notes,
        status: newRun.status
      }, ...prev]);
      
      // Save the completed run and potentially generate a goal
      const result = await completeRun(newRun.id, userId);
      
      if (result.generatedGoal) {
        setGoals(prev => [...prev, result.generatedGoal!]);
      }
    } catch (error) {
      console.error('Failed to complete run:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format pace from seconds to mm:ss
  const formatPace = (paceInSeconds: number): string => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle saving a new goal
  const handleGoalSaved = (newGoal: GoalData) => {
    setGoals(prev => [...prev, newGoal]);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Run Goal Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Run section */}
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
                    <div className="flex justify-between">
                      <span className="font-medium">{new Date(run.date).toLocaleDateString()}</span>
                      <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full">
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
                    {run.notes && (
                      <p className="mt-2 text-sm text-gray-600">{run.notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleCompleteRun} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Processing...' : 'Complete a 5K Run'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Goals section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Goals</CardTitle>
            <CardDescription>
              Goals will be automatically generated when you complete a run
            </CardDescription>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <p className="text-muted-foreground">No goals yet</p>
            ) : (
              <ul className="space-y-2">
                {goals.map(goal => (
                  <li key={goal.id} className="border rounded-md p-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Goal for {new Date(goal.targetDate).toLocaleDateString()}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        goal.status === 'Active' 
                          ? 'bg-blue-100 text-blue-800' 
                          : goal.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Target Distance</p>
                        <p>{goal.targetDistance.toFixed(2)} km</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Target Pace</p>
                        <p>{formatPace(goal.targetPace)}/km</p>
                      </div>
                    </div>
                    {goal.autoGenerated && (
                      <p className="mt-2 text-xs text-muted-foreground italic">
                        Automatically generated
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Goal generation handler */}
      <RunCompletionHandler
        userId={userId}
        runs={runs}
        goals={goals}
        onGoalSaved={handleGoalSaved}
      />
    </div>
  );
}
