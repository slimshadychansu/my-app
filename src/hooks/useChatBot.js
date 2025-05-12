// src/hooks/useChatBot.js
import { useState, useEffect, useRef } from 'react';
import { apiService } from '../utils/api';
import { useRecoilValue } from 'recoil';
import { userState } from '../store/atoms';
import { getPersonalizedRecipes, getCookingRelatedAnswer } from '../utils/recipeUtils';

export function useChatBot(showCookingGuide = false, currentRecipe = null) {
  const user = useRecoilValue(userState);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 초기 메시지 설정 (사용자 취향 반영)
  useEffect(() => {
    let initialMessage = {
      type: 'ai',
      content: '안녕하세요! 오늘은 어떤 요리를 도와드릴까요?',
      suggestion: '예시: "간단한 저녁 메뉴 추천해줘" 또는 "남은 재료로 만들 수 있는 요리 알려줘"'
    };

    // 사용자 정보가 있는 경우 맞춤형 메시지 표시
    if (user.name) {
      let personalizedSuggestion = '';
      
      // 조리 시간 기반 제안
      if (user.preferences?.cookingTime <= 15) {
        personalizedSuggestion = `${user.name}님은 빠른 요리를 선호하시네요. "15분 안에 만들 수 있는 요리 추천해줘"라고 물어보세요.`;
      } else if (user.preferences?.cookingTime >= 60) {
        personalizedSuggestion = `${user.name}님은 정성 들인 요리를 좋아하시네요. "주말에 만들기 좋은 특별한 요리 추천해줘"라고 물어보세요.`;
      }
      
      // 매운맛 선호도 반영
      if (user.preferences?.spicyLevel === '아주매움') {
        personalizedSuggestion = `${user.name}님은 매운 음식을 좋아하시네요. "매운 요리 추천해줘"라고 물어보세요.`;
      } else if (user.preferences?.spicyLevel === '안매움') {
        personalizedSuggestion = `${user.name}님은 맵지 않은 음식을 선호하시네요. "순한 맛 요리 추천해줘"라고 물어보세요.`;
      }
      
      // 채식주의 반영
      if (user.preferences?.vegetarian) {
        personalizedSuggestion = `${user.name}님은 채식을 선호하시네요. "채식 요리 추천해줘"라고 물어보세요.`;
      }
      
      initialMessage = {
        type: 'ai',
        content: `안녕하세요, ${user.name}님! 오늘은 어떤 요리를 도와드릴까요?`,
        suggestion: personalizedSuggestion || '예시: "간단한 저녁 메뉴 추천해줘" 또는 "내 취향에 맞는 요리 추천해줘"'
      };
    }
    
    setMessages([initialMessage]);
  }, [user]);

  // 채팅 스크롤 자동화
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 제출 핸들러
  const handleSubmit = async (e, voiceInput = null) => {
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
  };

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