// src/components/recipe/RecipeStep.jsx
import React, { useEffect } from 'react';
import speechUtils from '../../utils/chromeSpeechUtils';

function RecipeStep({ 
  step, 
  index, 
  currentStep, 
  onSelectStep, 
  timer, 
  hasTimer,
  autoReadEnabled = false // 자동 읽기 기능 활성화 여부
}) {
  const isActive = index === currentStep;
  
  // 현재 단계가 활성화되고 자동 읽기가 켜져 있으면 자동으로 읽기
  useEffect(() => {
    if (isActive && autoReadEnabled && speechUtils.checkSupport().tts) {
      // 읽을 내용 정제 (타이머 정보 포함)
      const timerText = step.timerMinutes > 0 
        ? `이 단계는 약 ${step.timerMinutes}분이 소요됩니다.` 
        : '';
        
      const textToRead = `${index + 1}단계: ${step.instruction} ${timerText}`;
      
      // 텍스트 읽기
      speechUtils.speak(textToRead, {
        rate: 0.9, // 약간 천천히 읽기
        onEnd: () => {
          console.log(`${index + 1}단계 읽기 완료`);
        }
      });
    }
    
    // 컴포넌트 언마운트 시 음성 중지
    return () => {
      if (isActive && autoReadEnabled) {
        speechUtils.stop();
      }
    };
  }, [isActive, autoReadEnabled, index, step]);

  return (
    <div 
      className={`border rounded-lg overflow-hidden transition-all duration-300 
        ${isActive 
          ? 'border-blue-500 dark:border-blue-600 shadow-md' 
          : 'border-gray-200 dark:border-gray-600'}`}
    >
      <div 
        className={`flex items-center p-4 cursor-pointer
          ${isActive 
            ? 'bg-blue-50 dark:bg-blue-900/20' 
            : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
        onClick={() => onSelectStep(index)}
      >
        <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 font-bold
          ${isActive 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}`}
        >
          {index + 1}
        </div>
        <h3 className={`font-medium ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
          {isActive ? (
            <span className="font-bold">현재 단계: {step.instruction.substring(0, 30)}{step.instruction.length > 30 ? '...' : ''}</span>
          ) : (
            <span>{step.instruction.substring(0, 30)}{step.instruction.length > 30 ? '...' : ''}</span>
          )}
        </h3>
      </div>
      
      {/* 현재 단계 상세 정보 */}
      {isActive && (
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
          <p className="text-gray-700 dark:text-gray-300 mb-4">{step.instruction}</p>
          
          {hasTimer && timer === null && (
            <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              이 단계에는 타이머가 필요합니다. 위의 타이머를 시작하세요.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(RecipeStep);