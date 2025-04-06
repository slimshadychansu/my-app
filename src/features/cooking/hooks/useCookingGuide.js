// src/features/cooking/hooks/useCookingGuide.js
import { useState, useCallback, useMemo } from 'react';
import { useRecipeTimer } from '../../../hooks/useRecipeTimer';

export function useCookingGuide(recipe, onComplete) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const { 
    timer, 
    timeLeft, 
    showTimerNotification, 
    setShowTimerNotification, 
    startTimer, 
    toggleTimer, 
    resetTimer, 
    formatTime, 
    calculateProgress,
    audioRef 
  } = useRecipeTimer();

  const goToNextStep = useCallback(() => {
    setCurrentStep(prev => 
      Math.min(recipe?.steps.length - 1, prev + 1)
    );
  }, [recipe?.steps.length]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const isLastStep = useMemo(() => 
    currentStep === (recipe?.steps.length - 1), 
    [currentStep, recipe?.steps.length]
  );

  const currentStepTimer = useMemo(() => 
    recipe?.steps[currentStep]?.timer || 0, 
    [recipe?.steps, currentStep]
  );

  return {
    currentStep,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    isLastStep,
    timer,
    timeLeft,
    showTimerNotification,
    setShowTimerNotification,
    startTimer,
    toggleTimer,
    resetTimer,
    formatTime,
    calculateProgress,
    audioRef,
    completeRecipe: onComplete,
    currentStepTimer
  };
}