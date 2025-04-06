// src/features/chat/components/ChatContainer.jsx
import React, { useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../store/atoms';
import { useVoiceRecognition } from '../../../hooks/useVoiceRecognition';
import ChatInterface from '../../../components/chat/ChatInterface';
import { apiService } from '../../../api/apiServices';

// 빠른 제안 및 요리 제안 데이터
const QUICK_SUGGESTIONS = [
  "간단한 저녁 메뉴 추천해줘",
  "파스타 요리법 알려줘",
  "건강한 샐러드 레시피 알려줘",
  "남은 계란으로 만들 수 있는 요리는?",
  "요리 초보를 위한 팁"
];

const COOKING_SUGGESTIONS = [
  "이 재료 대체할 수 있을까?",
  "다음 단계 미리 준비할게 있어?",
  "소금은 얼마나 넣어야 해?",
  "이 요리에 어울리는 음료는?",
  "요리 보관 방법 알려줘"
];

function ChatContainer({ 
  showCookingGuide = false, 
  currentRecipe = null, 
  onStartCooking = () => {}, 
  user = null 
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const userInfo = useRecoilValue(userState);
  
  // 사용자 정보가 제공되지 않았다면 Recoil에서 가져옴
  const currentUser = user || userInfo;

  // 초기 메시지 설정 (마운트 시)
  useEffect(() => {
    const initialMessage = {
      type: 'ai',
      content: currentUser.name 
        ? `안녕하세요, ${currentUser.name}님! 오늘은 어떤 요리를 도와드릴까요?`
        : '안녕하세요! 오늘은 어떤 요리를 도와드릴까요?',
      suggestion: '예시: "간단한 저녁 메뉴 추천해줘" 또는 "남은 재료로 만들 수 있는 요리 알려줘"'
    };

    setMessages([initialMessage]);
  }, [currentUser.name]);

  // 채팅 스크롤 자동화
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        // 요리 중 관련 질문에 대한 답변 생성
        const getCookingRelatedAnswer = (question, recipe) => {
          if (question.includes('대체') || question.includes('재료')) {
            return `일반적으로 ${recipe.title}에서 재료를 대체할 때는 비슷한 식감과 맛을 가진 것을 선택하는 것이 좋습니다. 구체적으로 어떤 재료를 대체하고 싶으신가요?`;
          }
          else if (question.includes('소금') || question.includes('간')) {
            return `${recipe.title}에는 전체 재료의 1~2% 정도의 소금이 적당합니다. 조금씩 넣어가며 맛을 보는 것이 좋아요.`;
          }
          else if (question.includes('보관') || question.includes('저장')) {
            return `${recipe.title}는 완전히 식힌 후 밀폐 용기에 담아 냉장 보관하시면 2~3일 정도 맛있게 드실 수 있습니다.`;
          }
          else {
            return `요리 중에 도움이 필요하시군요! ${recipe.title} 요리에 대해 더 구체적인 질문이 있으시면 알려주세요.`;
          }
        };
        
        const cookingResponse = getCookingRelatedAnswer(submitInput, currentRecipe);
        
        setMessages(prev => [...prev, {
          type: 'ai',
          content: cookingResponse
        }]);
      } else {
        // API 호출
        const response = await apiService.chat.sendMessage(submitInput);
        
        // 레시피 추천 응답인 경우 처리
        if (response.data.recipes && response.data.recipes.length > 0) {
          const recipe = response.data.recipes[0];
          
          setMessages(prev => [...prev, {
            type: 'ai',
            content: `${response.data.message || '다음 레시피를 추천해 드립니다:'} ${recipe.title}`,
            recipe: recipe
          }]);
        } else {
          // 일반 응답인 경우
          setMessages(prev => [...prev, {
            type: 'ai',
            content: response.data.message || '죄송합니다. 응답을 생성하는데 문제가 발생했습니다.',
            suggestion: response.data.suggestion || null
          }]);
        }
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
  
  // 음성 인식 결과 처리 콜백
  const handleVoiceResult = useCallback((transcript, isFinal) => {
    setInput(transcript);
    if (isFinal) {
      handleSubmit(null, transcript);
    }
  }, [setInput, handleSubmit]);
  
  // 음성 인식 훅 사용
  const { 
    isListening, 
    speechSupported, 
    toggleListening 
  } = useVoiceRecognition(handleVoiceResult);
  
  // 레시피 시작 핸들러
  const handleStartRecipe = useCallback((recipe) => {
    if (onStartCooking && typeof onStartCooking === 'function') {
      onStartCooking(recipe);
    }
  }, [onStartCooking]);
  
  // 현재 상태에 맞는 제안 선택
  const suggestions = showCookingGuide ? COOKING_SUGGESTIONS : QUICK_SUGGESTIONS;
  
  return (
    <div className={showCookingGuide ? "lg:col-span-2" : ""}>
      <ChatInterface 
        messages={messages}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isListening={isListening}
        speechSupported={speechSupported}
        toggleListening={toggleListening}
        quickSuggestions={suggestions}
        messagesEndRef={messagesEndRef}
        user={currentUser}
        compact={showCookingGuide}
        onStartRecipe={handleStartRecipe}
      />
    </div>
  );
}

ChatContainer.propTypes = {
  showCookingGuide: PropTypes.bool,
  currentRecipe: PropTypes.object,
  onStartCooking: PropTypes.func,
  user: PropTypes.object
};

export default React.memo(ChatContainer);