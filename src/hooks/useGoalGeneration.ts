
import { useState, useEffect } from 'react';
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
  
  // This effect will run whenever runs or goals change,
  // potentially generating a new goal if conditions are met
  useEffect(() => {
    // Skip if we're already processing
    if (isProcessing) return;
    
    // Check if we have enough data
    if (!userId || !runs.length) return;
    
    setIsProcessing(true);
    
    try {
      // Run our goal generation logic
      const generatedGoal = processAutomaticGoalGeneration(userId, runs, goals);
      
      if (generatedGoal) {
        setNewGoal(generatedGoal);
        
        // Call the callback if provided
        if (onGoalGenerated) {
          onGoalGenerated(generatedGoal);
        }
      }
    } catch (error) {
      console.error("Error generating goal:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [userId, runs, goals, onGoalGenerated, isProcessing]);
  
  // Manually trigger goal generation
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
