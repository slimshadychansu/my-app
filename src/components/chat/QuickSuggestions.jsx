// src/components/chat/QuickSuggestions.jsx
import React from 'react';

function QuickSuggestions({ suggestions, onSuggestionClick, user = null, extraButtons = [] }) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="text-xs font-medium px-4 py-2 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm border border-gray-200 dark:border-gray-600"
        >
          {suggestion}
        </button>
      ))}
      
      {/* 사용자 취향 기반 추천 버튼 (로그인 시에만 표시) */}
      {user?.name && (
        <button
          onClick={() => onSuggestionClick("내 취향에 맞는 요리 추천해줘")}
          className="text-xs font-medium px-4 py-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/40 transition-all duration-200 shadow-sm border border-blue-200 dark:border-blue-800/60"
        >
          내 취향 요리 추천해줘
        </button>
      )}

      {/* 추가 버튼들 */}
      {extraButtons.map((button, index) => (
        <button
          key={`extra-${index}`}
          onClick={button.onClick}
          className={button.className}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}

export default QuickSuggestions;