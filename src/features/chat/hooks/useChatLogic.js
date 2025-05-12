// src/features/chat/hooks/useChatLogic.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { apiService } from '../../../api/apiServices';
import { getCookingRelatedAnswer } from '../../../utils/recipeUtils';

export function useChatLogic(showCookingGuide = false, currentRecipe = null) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 초기 메시지 설정
  useEffect(() => {
    let initialMessage = {
      type: 'ai',
      content: '안녕하세요! 오늘은 어떤 요리를 도와드릴까요?',
      suggestion: '예시: "간단한 저녁 메뉴 추천해줘" 또는 "남은 재료로 만들 수 있는 요리 알려줘"'
    };

    setMessages([initialMessage]);
  }, []);

  // 채팅 스크롤 자동화
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 제출 핸들러
  const handleSubmit = useCallback(async (e, voiceInput = null) => {
    e?.preventDefault();
    
    const submitInput = voiceInput || input;
    if (!submitInput.trim() || isLoading) return;
  
    setMessages(prev => [...prev, { type: 'user', content: submitInput }]);
    setIsLoading(true);
  
    try {
      // 요리 가이드 모드에서의 질문
      if (showCookingGuide && currentRecipe) {
        const cookingResponse = getCookingRelatedAnswer(submitInput, currentRecipe);
        setMessages(prev => [...prev, {
          type: 'ai',
          content: cookingResponse
        }]);
      } else {
        // API 호출
        const response = await apiService.chat.sendMessage(submitInput);
        setMessages(prev => [...prev, {
          type: 'ai',
          content: response.data.message,
          suggestion: response.data.suggestion || null
        }]);
      }
    } catch (error) {
      console.error('API 요청 오류:', error);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: '죄송합니다. 서버와 통신 중 오류가 발생했습니다.'
      }]);
    } finally {
      setIsLoading(false);
    }
  
    setInput('');
  }, [input, isLoading, showCookingGuide, currentRecipe]);

  return { 
    messages, 
    setMessages, 
    input, 
    setInput, 
    isLoading, 
    handleSubmit,
    messagesEndRef
  };
}