
import { useEffect, useState, useRef } from 'react';
import { RunData } from '@/types/run';
import { GoalData } from '@/types/goal';
import { useGoalGeneration } from '@/hooks/useGoalGeneration';
import { saveGoal } from '@/services/runGoalService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

interface RunCompletionHandlerProps {
  userId: string;
  runs: RunData[];
  goals: GoalData[];
  onGoalSaved?: (goal: GoalData) => void;
}

export function RunCompletionHandler({
  userId,
  runs,
  goals,
  onGoalSaved
}: RunCompletionHandlerProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [newGoal, setNewGoal] = useState<GoalData | null>(null);
  const savedGoalRef = useRef<string | null>(null);

  // Handle goal generation
  const handleGoalGenerated = async (generatedGoal: GoalData) => {
    try {
      // Check if we've already processed this goal (preventing duplicates)
      if (savedGoalRef.current === generatedGoal.id) {
        return;
      }
      
      // Save the generated goal
      const savedGoal = await saveGoal(generatedGoal);
      
      // Store reference to prevent duplicate processing
      savedGoalRef.current = savedGoal.id;
      
      // Update state
      setNewGoal(savedGoal);
      setShowAlert(true);
      
      // Notify parent component
      if (onGoalSaved) {
        onGoalSaved(savedGoal);
      }
      
      // Show toast notification - only once
      toast('New goal created!', {
        description: `We've set a new target for you: ${savedGoal.targetDistance.toFixed(2)}km at a pace of ${formatPace(savedGoal.targetPace)}/km by ${formatDate(savedGoal.targetDate)}.`
      });
    } catch (error) {
      console.error('Failed to save automatically generated goal:', error);
      toast('Failed to create goal', {
        description: 'There was a problem creating your new goal. Please try again.'
      });
    }
  };

  // Use our hook to handle automatic goal generation
  const { isProcessing } = useGoalGeneration({
    userId,
    runs,
    goals,
    onGoalGenerated: handleGoalGenerated
  });

  // Helper function to format pace (seconds to mm:ss)
  const formatPace = (paceInSeconds: number): string => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Helper function to format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };

  // Hide the alert after 10 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // If we're still processing or there's no new goal, don't render anything
  if (isProcessing || !newGoal || !showAlert) {
    return null;
  }

  return (
    <Alert className="mt-4">
      <AlertTitle>New Goal Generated!</AlertTitle>
      <AlertDescription>
        <p>Based on your latest run, we've set a new goal for you:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Target distance: {newGoal.targetDistance.toFixed(2)} km</li>
          <li>Target pace: {formatPace(newGoal.targetPace)} per km</li>
          <li>Achieve by: {formatDate(newGoal.targetDate)}</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
