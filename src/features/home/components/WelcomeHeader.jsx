// src/features/home/components/WelcomeHeader.jsx
import React from 'react';

const WelcomeHeader = ({ user }) => {
  return (
    <div className="text-center pt-6 mb-8">
      <div className="inline-block relative mb-2">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-fadeIn">
          달그락
        </h1>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"></div>
      </div>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 animate-slideUp mt-6">
        {user.name 
          ? `${user.name}님, 오늘은 어떤 요리를 해볼까요?`
          : '당신만을 위한 AI 요리 어시스턴트'}
      </p>
    </div>
  );
};

export default React.memo(WelcomeHeader);