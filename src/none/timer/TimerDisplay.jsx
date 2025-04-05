// src/components/timer/TimerDisplay.jsx
import React from 'react';

function TimerDisplay({ 
  timer, 
  timeLeft, 
  startTimer, 
  toggleTimer, 
  resetTimer, 
  formatTime, 
  calculateProgress, 
  duration 
}) {
  return (
    <div className="mb-6 flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-medium mb-3 dark:text-white">타이머</h3>
      
      {timer === null ? (
        <button 
          onClick={() => startTimer(duration)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center gap-2 shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          타이머 시작 ({formatTime(duration)})
        </button>
      ) : (
        <div className="flex flex-col items-center w-full">
          {/* 원형 타이머 */}
          <div className="relative w-48 h-48 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* 배경 원 */}
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke={timer === 'paused' ? "#e5e7eb" : "#f3f4f6"}
                strokeWidth="8"
              />
              {/* 진행 원 */}
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke={timer === 'paused' ? "#93c5fd" : "#3b82f6"} 
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * calculateProgress() / 100)}
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <span className="text-4xl font-mono font-bold dark:text-white">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          {/* 타이머 컨트롤 */}
          <div className="flex gap-4 w-full justify-center">
            <button 
              onClick={toggleTimer}
              className={`px-5 py-3 rounded-lg flex-1 flex items-center justify-center gap-2 shadow-sm max-w-xs
                  ${timer === 'running' 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
            >
              {timer === 'running' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  일시정지
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  재개
                </>
              )}
            </button>
            <button 
              onClick={() => resetTimer(duration)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded-lg flex-1 flex items-center justify-center gap-2 shadow-sm max-w-xs"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              리셋
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimerDisplay;