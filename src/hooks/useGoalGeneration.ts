import { useState, useEffect, useRef } from 'react';
import { RunData } from '@/types/run';
import { GoalData } from '@/types/goal';
import { processAutomaticGoalGeneration } from '@/utils/goalGenerator';

interface UseGoalGenerationProps {
  userId: string;
  runs: RunData[];
  goals: GoalData[];
  onGoalGenerated?: (newGoal: GoalData) => void;
}

export function useGoalGeneration({
  userId,
  runs,
  goals,
  onGoalGenerated
}: UseGoalGenerationProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [newGoal, setNewGoal] = useState<GoalData | null>(null);
  const processedRef = useRef(false);
  
  // This effect will run only once per component mount
  useEffect(() => {
    // Skip if we're already processing or have processed
    if (isProcessing || processedRef.current) return;
    
    // Check if we have enough data
    if (!userId || !runs.length) return;
    
    setIsProcessing(true);
    
    try {
      // Check if there's already an active goal
      const hasActive = goals.some(goal => goal.status === 'Active');
      
      if (!hasActive) {
        // Run our goal generation logic
        const generatedGoal = processAutomaticGoalGeneration(userId, runs, goals);
        
        if (generatedGoal) {
          setNewGoal(generatedGoal);
          
          // Call the callback if provided
          if (onGoalGenerated) {
            onGoalGenerated(generatedGoal);
          }
        }
      }
      
      // Mark as processed so we don't keep generating goals
      processedRef.current = true;
    } catch (error) {
      console.error("Error generating goal:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [userId, runs, goals, onGoalGenerated, isProcessing]);
  
  // Manually trigger goal generation - only used when explicitly called
  const checkAndGenerateGoal = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const generatedGoal = processAutomaticGoalGeneration(userId, runs, goals);
      
      if (generatedGoal) {
        setNewGoal(generatedGoal);
        
        if (onGoalGenerated) {
          onGoalGenerated(generatedGoal);
        }
      }
    } catch (error) {
      console.error("Error generating goal:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    newGoal,
    checkAndGenerateGoal
  };
}
