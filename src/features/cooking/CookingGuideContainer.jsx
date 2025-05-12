// src/features/cooking/CookingGuideContainer.jsx
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useCookingGuide } from "./hooks/useCookingGuide";
import CookingProgressBar from "./CookingProgressBar";
import RecipeStep from "../../components/recipe/RecipeStep";
import CircularTimerDisplay from "../../components/timer/CircularTimerDisplay";
import TimerNotification from "../../components/timer/TimerNotification";
import speechUtils from "../../utils/chromeSpeechUtils"; // 추가

const CookingGuideContainer = React.memo(function CookingGuideContainer({ 
  recipe, 
  onComplete, 
  onClose 
}) {
  const cookingGuide = useCookingGuide(recipe, onComplete);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false); // 자동 읽기 상태
  const [ttsSupported, setTtsSupported] = useState(false); // TTS 지원 여부

  // TTS 지원 확인
  useEffect(() => {
    const support = speechUtils.checkSupport();
    setTtsSupported(support.tts);
    
    // 로컬 스토리지에서 자동 읽기 설정 불러오기
    const savedAutoRead = localStorage.getItem('recipe-auto-read');
    if (savedAutoRead) {
      setAutoReadEnabled(savedAutoRead === 'true');
    }
    
    // 컴포넌트 언마운트시 음성 중지
    return () => {
      speechUtils.stop();
    };
  }, []);
  
  // 자동 읽기 토글 핸들러
  const toggleAutoRead = () => {
    const newValue = !autoReadEnabled;
    setAutoReadEnabled(newValue);
    localStorage.setItem('recipe-auto-read', newValue.toString());
    
    // 자동 읽기를 켰을 때 현재 단계 즉시 읽기
    if (newValue && recipe.steps[cookingGuide.currentStep]) {
      const currentStepData = recipe.steps[cookingGuide.currentStep];
      const textToRead = `${cookingGuide.currentStep + 1}단계: ${currentStepData.instruction}`;
      
      speechUtils.speak(textToRead, {
        rate: 0.9
      });
    } else {
      // 자동 읽기를 껐을 때 음성 중지
      speechUtils.stop();
    }
  };

  // 유효성 검사를 위한 effect 추가
  useEffect(() => {
    if (!recipe || !recipe.steps || recipe.steps.length === 0) {
      console.error("CookingGuideContainer: 올바르지 않은 레시피 구조", recipe);
    } else {
      console.log(`요리 가이드 시작: ${recipe.title}, ${recipe.steps.length}단계`);
    }
  }, [recipe]);

  // 디버깅용 타이머 토글 함수
  const debugToggleTimer = () => {
    console.log('타이머 토글 전:', cookingGuide.isRunning);
    cookingGuide.toggleTimer();
    // 비동기 상태 업데이트 확인을 위한 지연 로깅
    setTimeout(() => {
      console.log('타이머 토글 후:', cookingGuide.isRunning);
    }, 100);
  };

  const renderSteps = useCallback(() => {
    if (!recipe || !recipe.steps || recipe.steps.length === 0) {
      return (
        <div className="p-4 bg-red-50 text-red-500 rounded-lg">
          레시피 정보가 올바르지 않습니다. 다시 시도해주세요.
        </div>
      );
    }
    
    return recipe.steps.map((step, index) => (
      <RecipeStep 
        key={index}
        step={step}
        index={index}
        currentStep={cookingGuide.currentStep}
        onSelectStep={cookingGuide.setCurrentStep}
        timer={cookingGuide.timeLeft}
        hasTimer={step.timer > 0}
        autoReadEnabled={autoReadEnabled} // 자동 읽기 설정 전달
      />
    ));
  }, [recipe, cookingGuide.currentStep, cookingGuide.setCurrentStep, cookingGuide.timeLeft, autoReadEnabled]);

  // 레시피가 유효하지 않은 경우 오류 메시지 표시
  if (!recipe || !recipe.steps || recipe.steps.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-3">오류 발생</h3>
          <p>레시피 정보가 올바르지 않습니다. 다시 시도해주세요.</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 현재 단계에서 타이머 시간 가져오기 (기본값 0분 설정)
  const currentStepTimer = recipe.steps[cookingGuide.currentStep]?.timer || 0;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">{recipe.title}</h2>
        
        {/* 자동 읽기 토글 버튼 추가 */}
        {ttsSupported && (
          <div className="mb-4 flex items-center justify-end">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={autoReadEnabled} 
                onChange={toggleAutoRead}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                자동 읽기 {autoReadEnabled ? "켜짐" : "꺼짐"}
              </span>
            </label>
          </div>
        )}
        
        <CookingProgressBar 
          currentStep={cookingGuide.currentStep} 
          totalSteps={recipe.steps.length} 
        />

        {/* 타이머가 있는 경우에만 표시 */}
        {currentStepTimer > 0 ? (
          <CircularTimerDisplay 
            timeLeft={cookingGuide.timeLeft}
            isRunning={cookingGuide.isRunning}
            duration={currentStepTimer * 60}
            formatTime={cookingGuide.formatTime}
            toggleTimer={cookingGuide.toggleTimer} // 직접 toggleTimer 함수 전달
          />
        ) : (
          <div className="mb-6 text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              이 단계에는 타이머가 설정되어 있지 않습니다.
            </p>
          </div>
        )}

        <div className="mb-6 space-y-4">
          {renderSteps()}
        </div>

        <div className="flex justify-between mt-8">
          <button 
            onClick={cookingGuide.goToPreviousStep}
            disabled={cookingGuide.currentStep === 0}
            className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors
              ${cookingGuide.currentStep === 0 
                  ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            이전
          </button>
          
          {cookingGuide.isLastStep ? (
            <button 
              onClick={cookingGuide.completeRecipe}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md"
            >
              요리 완료
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          ) : (
            <button 
              onClick={cookingGuide.goToNextStep}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md"
            >
              다음
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          )}
        </div>
        
        <TimerNotification 
          isOpen={cookingGuide.showNotification}
          onClose={() => cookingGuide.setShowNotification(false)}
        />
      </div>
    </div>
  );
});

CookingGuideContainer.propTypes = {
  recipe: PropTypes.shape({
    title: PropTypes.string,
    steps: PropTypes.arrayOf(PropTypes.shape({
      instruction: PropTypes.string.isRequired,
      timer: PropTypes.number
    })).isRequired
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func
};

export default CookingGuideContainer;