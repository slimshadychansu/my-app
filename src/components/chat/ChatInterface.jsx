// src/components/chat/ChatInterface.jsx
import React ,{ useRef }from 'react';
import RecipeCard from '../recipe/RecipeCard';
import ChatMessage from './ChatMessage';
import QuickSuggestions from './QuickSuggestions';

function ChatInterface({ 
  messages, 
  input, 
  setInput, 
  handleSubmit, 
  isLoading, 
  isListening, 
  speechSupported, 
  toggleListening,
  quickSuggestions = [],
  messagesEndRef,
  user = null,
  compact = false,
  onStartRecipe
}) {
  // 채팅 창의 크기와 패딩을 결정
  const containerClasses = compact 
    ? "h-[350px] p-4" 
    : "h-[450px] p-5";
  
  const handleQuickSuggestion = (suggestion) => {
    setInput(suggestion);
    handleSubmit(null, suggestion);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border ${compact ? 'border-blue-200 dark:border-blue-800' : 'border-gray-100 dark:border-gray-700'} p-5 animate-fadeIn`}>
      {/* 요리 도우미 헤더 (compact 모드에서만) */}
      {compact && (
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
            <span className="text-white font-medium">AI</span>
          </div>
          <h3 className="text-xl font-bold dark:text-white">요리 도우미</h3>
        </div>
      )}

       {/* 채팅 메시지 영역 */}
      <div 
        className={`chat-messages ${containerClasses} overflow-y-auto mb-5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600`}
      >
        {messages.map((message, index) => (
          <ChatMessage 
            key={index}
            message={message}
            isUser={message.type === 'user'}
            animationDelay={index * 0.1}
            onStartRecipe={onStartRecipe}
            isCookingMode={compact}
          />
        ))}
        
        <div ref={messagesEndRef} />
        
        {isLoading && (
          <div className="flex items-center ml-12 my-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3 shadow-md">
              <span className="text-white text-sm font-medium">AI</span>
            </div>
            <div className="typing-indicator bg-white dark:bg-gray-800 py-2 px-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      
      {/* 빠른 제안 */}
      <QuickSuggestions 
        suggestions={quickSuggestions}
        onSuggestionClick={handleQuickSuggestion}
        user={user}
      />

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || isListening}
            placeholder={isListening ? "말씀해주세요..." : "예) 오늘은 파스타를 만들고 싶어요"}
            className={`w-full p-4 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 
                     dark:bg-gray-700 dark:text-white shadow-sm
                     dark:placeholder-gray-400 transition-all duration-300
                     ${isListening ? 'pr-12 pl-4 border-red-400 dark:border-red-500' : ''}`}
          />
          
          {/* 음성 인식 버튼 */}
          {speechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              disabled={isLoading}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full
                       ${isListening 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                       } transition-all duration-300`}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                ></path>
              </svg>
            </button>
          )}
        </div>
        
        <button 
          type="submit"
          disabled={isLoading || isListening || !input.trim()}
          className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-full 
                   transition-all duration-300 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800
                   transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-md
                   ${(isLoading || isListening || !input.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      </form>
      
      {/* 음성 인식 안내 */}
      {speechSupported && !compact && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full shadow-sm">
            <span className="text-lg">🎙️</span>
            <p>마이크 버튼을 누르고 말씀해보세요!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;