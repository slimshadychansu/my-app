// src/features/cooking/hooks/useCookingGuide.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRecipeTimer } from '../../../hooks/useRecipeTimer';
import speechUtils from '../../../utils/chromeSpeechUtils'; // 추가

/**
 * 요리 가이드 관련 상태와 함수를 제공하는 커스텀 훅
 */
export function useCookingGuide(recipe, onComplete) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // 레시피 유효성 검사
  useEffect(() => {
    if (!recipe) {
      console.error('레시피 데이터가 없습니다.');
      return;
    }
    
    if (!recipe.steps || !Array.isArray(recipe.steps) || recipe.steps.length === 0) {
      console.error('레시피에 단계 정보가 없습니다:', recipe);
      return;
    }
    
    console.log('레시피 로드 완료:', recipe.title, `(${recipe.steps.length}단계)`);
  }, [recipe]);
  
  // 현재 단계의 타이머 시간 계산 (분을 초로 변환)
  const currentStepTimerSeconds = useMemo(() => {
    if (!recipe?.steps || !recipe.steps[currentStep]) return 0;
    
    const timerMinutes = recipe.steps[currentStep].timer || 0;
    const timerSeconds = timerMinutes * 60;
    
    console.log('현재 단계 타이머 시간:', timerMinutes, '분 (', timerSeconds, '초)');
    return timerSeconds;
  }, [recipe?.steps, currentStep]);
  
  // 타이머 훅 사용
  const timerControls = useRecipeTimer(currentStepTimerSeconds);

  // 현재 단계가 변경될 때마다 타이머 리셋
  useEffect(() => {
    if (!recipe?.steps || !recipe.steps[currentStep]) {
      console.log('유효한 레시피 단계가 없어 타이머를 초기화하지 않습니다.');
      return;
    }
    
    const timerSeconds = currentStepTimerSeconds;
    console.log('단계 변경 - 타이머 초기화:', currentStep + 1, '번째 단계, 시간:', timerSeconds, '초');
    
    // 타이머 시간이 있는 경우에만 초기화하고, 실행 중이 아닐 때만 초기화
    if (timerSeconds > 0 && !timerControls.isRunning) {
      timerControls.resetTimer(timerSeconds);
    } else if (timerSeconds <= 0) {
      console.log('이 단계에는 타이머가 없습니다.');
    }
  }, [currentStep, recipe?.steps, currentStepTimerSeconds, timerControls]); 
  
  // 마지막 단계 여부 계산
  const isLastStep = useMemo(() => {
    if (!recipe?.steps) return true;
    return currentStep === (recipe.steps.length - 1);
  }, [currentStep, recipe?.steps]);

  // 다음 단계로 이동
  const goToNextStep = useCallback(() => {
    if (!recipe?.steps) {
      console.error('레시피 단계 정보가 없어 다음 단계로 이동할 수 없습니다.');
      return;
    }
    
    // 현재 재생 중인 모든 TTS 중지
    speechUtils.stop();
    
    setCurrentStep(prev => {
      const nextStep = Math.min(recipe.steps.length - 1, prev + 1);
      console.log('다음 단계로 이동:', prev + 1, '->', nextStep + 1);
      return nextStep;
    });
  }, [recipe?.steps]);

  // 이전 단계로 이동
  const goToPreviousStep = useCallback(() => {
    // 현재 재생 중인 모든 TTS 중지
    speechUtils.stop();
    
    setCurrentStep(prev => {
      const prevStep = Math.max(0, prev - 1);
      console.log('이전 단계로 이동:', prev + 1, '->', prevStep + 1);
      return prevStep;
    });
  }, []);

  // 요리 완료 처리
  const completeRecipe = useCallback(() => {
    console.log('요리 완료!');
    if (typeof onComplete === 'function') {
      onComplete();
    } else {
      console.warn('onComplete 함수가 제공되지 않았습니다.');
    }
  }, [onComplete]);

  return {
    currentStep,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    isLastStep,
    completeRecipe,
    timeLeft: timerControls.timeLeft,
    isRunning: timerControls.isRunning,
    showNotification: timerControls.showNotification,
    setShowNotification: timerControls.setShowNotification,
    startTimer: timerControls.startTimer,
    pauseTimer: timerControls.pauseTimer,
    toggleTimer: timerControls.toggleTimer, // 이 부분이 제대로 전달되어야 함
    resetTimer: timerControls.resetTimer,
    formatTime: timerControls.formatTime,
    calculateProgress: timerControls.calculateProgress
  };
}

export default useCookingGuide;