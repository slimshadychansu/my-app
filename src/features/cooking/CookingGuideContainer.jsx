// src/features/cooking/CookingGuideContainer.jsx
import React, { useCallback } from 'react';
import { useCookingGuide } from "./hooks/useCookingGuide";
import CookingProgressBar from "./CookingProgressBar";
import RecipeStep from "../../components/recipe/RecipeStep";
import TimerDisplay from "../../components/timer/TimerDisplay";
import TimerNotification from "../../components/timer/TimerNotification";
import PropTypes from 'prop-types';

const CookingGuideContainer = React.memo(({ 
  recipe, 
  onComplete, 
  onClose 
}) => {
  const cookingGuide = useCookingGuide(recipe, onComplete);

  const renderSteps = useCallback(() => {
    return recipe.steps.map((step, index) => (
      <RecipeStep 
        key={index}
        step={step}
        index={index}
        currentStep={cookingGuide.currentStep}
        onSelectStep={cookingGuide.setCurrentStep}
      />
    ));
  }, [recipe.steps, cookingGuide.currentStep]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <CookingProgressBar 
          currentStep={cookingGuide.currentStep} 
          totalSteps={recipe.steps.length} 
        />

        <TimerDisplay 
          {...cookingGuide}
          duration={recipe.steps[cookingGuide.currentStep].timer || 0}
        />

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
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg"
            >
              요리 완료
            </button>
          ) : (
            <button 
              onClick={cookingGuide.goToNextStep}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg"
            >
              다음
            </button>
          )}
        </div>
        

        <TimerNotification 
          isOpen={cookingGuide.showTimerNotification}
          onClose={() => cookingGuide.setShowTimerNotification(false)}
        />
      </div>
    </div>
  );
});
CookingGuideContainer.propTypes = {
  recipe: PropTypes.shape({
    steps: PropTypes.arrayOf(PropTypes.shape({
      instruction: PropTypes.string.isRequired,
      timer: PropTypes.number
    })).isRequired
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func
};
export default CookingGuideContainer;