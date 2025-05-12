// src/components/timer/CircularTimerDisplay.jsx
import React, { memo } from 'react';
import PropTypes from 'prop-types';

const CircularTimerDisplay = memo(function CircularTimerDisplay({ 
  timeLeft, 
  isRunning, 
  duration, 
  formatTime, 
  toggleTimer 
}) {
  // 원형 진행 정도 계산 (0-359.99도)
  const calculateCircleProgress = (current, total) => {
    if (total <= 0) return 359.99;
    const progress = 359.99 * (1 - current / total);
    return progress > 359.99 ? 359.99 : progress; // 최대값 제한
  };
  
  // 타이머 토글 함수 - 이벤트 충돌 방지를 위한 래퍼 함수
  const handleToggleTimer = (e) => {
    e.stopPropagation();
    console.log('타이머 토글 버튼 클릭됨, 현재 상태:', isRunning);
    // toggleTimer가 함수인지 확인 후 호출
    if (typeof toggleTimer === 'function') {
      toggleTimer();
    } else {
      console.error('toggleTimer is not a function:', toggleTimer);
    }
  };
  
  const progress = calculateCircleProgress(timeLeft, duration);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 359.99) * circumference;
  
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
          {/* 버튼에 이벤트 핸들러 래퍼 함수 사용 */}
          <button 
            onClick={handleToggleTimer} 
            className={`text-xs px-3 py-1 rounded-full ${
              isRunning 
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400' 
                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
            }`}
          >
            {isRunning ? '중지' : '시작'}
          </button>
        </div>
        
        {/* 원형 타이머 - onClick 이벤트 제거 */}
        <div className="flex justify-center items-center py-3">
          <div className="relative w-32 h-32">
            {/* 베이스 원 */}
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle 
                cx="60" 
                cy="60" 
                r={radius}
                fill="transparent"
                stroke="#e5e7eb" 
                strokeWidth="8"
                className="dark:stroke-gray-700"
              />
              {/* 진행 원 */}
              <circle 
                cx="60" 
                cy="60" 
                r={radius}
                fill="transparent"
                stroke="#3b82f6" 
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                className="transition-all duration-300 ease-linear"
              />
            </svg>
            {/* 중앙 시간 표시 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold dark:text-white">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          타이머를 {isRunning ? '중지' : '시작'}하려면 위 버튼을 클릭하세요
        </p>
      </div>
    </div>
  );
});

CircularTimerDisplay.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  isRunning: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
  formatTime: PropTypes.func.isRequired,
  toggleTimer: PropTypes.func.isRequired
};

export default CircularTimerDisplay;