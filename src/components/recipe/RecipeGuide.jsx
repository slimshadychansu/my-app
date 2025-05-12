// src/components/recipe/RecipeGuide.jsx
import React, { useEffect } from 'react';
import RecipeStep from './RecipeStep';
import TimerDisplay from '../timer/TimerDisplay';
import TimerNotification from '../timer/TimerNotification';

function RecipeGuide({ 
  recipe, 
  currentStep, 
  setCurrentStep, 
  timer, 
  timeLeft, 
  startTimer, 
  toggleTimer, 
  resetTimer, 
  formatTime, 
  calculateProgress, 
  showTimerNotification, 
  setShowTimerNotification,
  completeRecipe,
  onClose,
  isRunning
}) {
  const isLastStep = currentStep === recipe?.steps.length - 1;

  // 현재 단계의 타이머 시간
  const currentTimerDuration = recipe?.steps[currentStep]?.timer || 0;
  
  // 단계가 변경될 때 타이머가 있으면 자동으로 시작
  useEffect(() => {
    if (currentTimerDuration > 0) {
      // 명확한 시간값(초)을 전달하고 있는지 확인
      const timerSeconds = currentTimerDuration * 60;
      console.log(`타이머 시작: ${timerSeconds}초`);
      
      // 직접 시간값을 전달하여 시작
      startTimer(timerSeconds);
    }
  }, [currentStep, currentTimerDuration, startTimer]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-5">
      {/* 헤더 - 요리 제목 및 닫기 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white">{recipe.title} 요리 가이드</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      {/* 타이머 섹션 (위쪽 배치) */}
      {currentTimerDuration > 0 && (
        <TimerDisplay 
          timer={timer}
          timeLeft={timeLeft}
          startTimer={() => startTimer(currentTimerDuration * 60)}
          toggleTimer={toggleTimer}
          resetTimer={() => resetTimer(currentTimerDuration * 60)}
          formatTime={formatTime}
          calculateProgress={calculateProgress}
          duration={currentTimerDuration * 60}
          isRunning={isRunning}
        />
      )}
      
      {/* 진행 상태 바 */}
      <div className="mb-4 relative pt-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
              진행률
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-300">
              {Math.round((currentStep / (recipe?.steps.length - 1)) * 100)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900/30">
          <div 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 dark:bg-blue-600 transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / (recipe?.steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* 요리 단계 목록 */}
      <div className="mb-6 space-y-4">
        {recipe.steps.map((step, index) => (
          <RecipeStep 
            key={index}
            step={step}
            index={index}
            currentStep={currentStep}
            onSelectStep={setCurrentStep}
            timer={timer}
            hasTimer={step.timer > 0}
          />
        ))}
      </div>
      
      {/* 이전/다음/완료 버튼 */}
      <div className="flex justify-between mt-6">
        <button 
          onClick={() => {
            setCurrentStep(prev => Math.max(0, prev - 1));
          }}
          disabled={currentStep === 0}
          className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors
              ${currentStep === 0 
                  ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          이전
        </button>
        
        {isLastStep ? (
          <button 
            onClick={completeRecipe}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md"
          >
            요리 완료
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        ) : (
          <button 
            onClick={() => {
              setCurrentStep(prev => Math.min(recipe?.steps.length - 1, prev + 1));
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md"
          >
            다음
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        )}
      </div>
      
      {/* 타이머 알림 */}
      <TimerNotification 
        isOpen={showTimerNotification} 
        onClose={() => setShowTimerNotification(false)} 
      />
    </div>
  );
}

export default RecipeGuide;