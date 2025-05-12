// src/components/timer/TimerDisplay.jsx
import React, { memo } from 'react';
import PropTypes from 'prop-types';

const TimerDisplay = memo(function TimerDisplay({ 
  timeLeft, 
  isRunning, 
  duration, 
  formatTime, 
  calculateProgress, 
  toggleTimer 
}) {
  const progress = calculateProgress(timeLeft, duration);
  
  return (
    <div className="mb-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="font-medium dark:text-white">타이머</span>
          </div>
          <button 
            onClick={toggleTimer} 
            className={`text-xs px-3 py-1 rounded-full ${
              isRunning 
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400' 
                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
            }`}
          >
            {isRunning ? '중지' : '시작'}
            
          </button>
        </div>
        
        <div className="text-center py-3">
          <div className="text-3xl font-bold dark:text-white">
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-linear" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
});

TimerDisplay.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  isRunning: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
  formatTime: PropTypes.func.isRequired,
  calculateProgress: PropTypes.func.isRequired,
  toggleTimer: PropTypes.func.isRequired
};

export default TimerDisplay;