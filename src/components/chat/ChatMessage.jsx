// src/components/chat/ChatMessage.jsx
import React from 'react';

function ChatMessage({ message, isUser, animationDelay = 0 }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-5`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3 shadow-md">
          <span className="text-white text-sm font-medium">AI</span>
        </div>
      )}
      
      <div 
        className={`py-3 px-5 rounded-2xl max-w-[75%] animate-messageIn shadow-sm
          ${!isUser 
            ? 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-100' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto'
          }`}
        style={{
          animationDelay: `${animationDelay}s`,
        }}
      >
        <div className="prose dark:prose-invert">
          {message.content}
        </div>
        
        {message.suggestion && (
          <p className="text-xs mt-2 opacity-80 italic">
            {message.suggestion}
          </p>
        )}
      </div>
      
      {isUser && (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center ml-3 shadow-md">
          <span className="text-gray-500 dark:text-gray-300 text-sm font-medium">나</span>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;