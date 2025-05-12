// src/features/chat/hooks/useChatMessages.js
import { useState, useEffect, useRef } from 'react';

export function useChatMessages(currentUser, showCookingGuide, currentRecipe) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // 초기 메시지 설정
  useEffect(() => {
    if (showCookingGuide && currentRecipe) {
      const initialMessage = {
        type: 'ai',
        content: `${currentRecipe.title} 요리를 시작하셨네요! 요리하는 동안 궁금한 점이 있으면 언제든지 물어보세요.`,
        suggestion: '예시: "이 재료 대체할 수 있을까?", "소금은 얼마나 넣어야 해?", "보관 방법은?"'
      };
      setMessages([initialMessage]);
      return;
    }

    const initialMessage = {
      type: 'ai',
      content: currentUser.name 
        ? `안녕하세요, ${currentUser.name}님! 오늘은 어떤 요리를 도와드릴까요?`
        : '안녕하세요! 오늘은 어떤 요리를 도와드릴까요?',
      suggestion: '예시: "간단한 저녁 메뉴 추천해줘" 또는 "남은 재료로 만들 수 있는 요리 알려줘"'
    };

    setMessages([initialMessage]);
  }, [currentUser.name, showCookingGuide, currentRecipe]);

  // 채팅 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 사용자 메시지 추가
  const addUserMessage = (content) => {
    setMessages(prev => [...prev, { type: 'user', content }]);
  };

  // AI 메시지 추가
  const addAIMessage = (content, suggestion = null) => {
    setMessages(prev => [...prev, { type: 'ai', content, suggestion }]);
  };

  // 레시피가 포함된 AI 메시지 추가
  const addAIMessageWithRecipe = (content, recipe, suggestion = null) => {
    setMessages(prev => [...prev, { type: 'ai', content, recipe, suggestion }]);
  };

  // 오류 메시지 추가
  const addAIErrorMessage = (errorMessage) => {
    setMessages(prev => [...prev, { 
      type: 'ai', 
      content: errorMessage,
      isError: true
    }]);
  };

  return {
    messages,
    setMessages,
    messagesEndRef,
    addUserMessage,
    addAIMessage,
    addAIMessageWithRecipe,
    addAIErrorMessage
  };
}