// src/features/cooking/CookingProgressBar.jsx
import React from 'react';
import PropTypes from 'prop-types';

const CookingProgressBar = React.memo(({ currentStep, totalSteps }) => {
  const progress = totalSteps > 1 
    ? (currentStep / (totalSteps - 1)) * 100 
    : 0;

  return (
    <div className="mb-6 relative pt-1">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
            진행률
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-blue-600">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
        <div 
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
});

CookingProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired
};

export default CookingProgressBar;