// src/features/chat/components/ChatContainer.jsx
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../store/atoms';
import { useVoiceRecognition } from '../../../hooks/useVoiceRecognition';
import ChatInterface from '../../../components/chat/ChatInterface';
import { useChatMessages } from '../hooks/useChatMessages';
import { useChatAPI } from '../hooks/useChatAPI';
import { useRecipeParsing } from '../hooks/useRecipeParsing';
import { GENERAL_SUGGESTIONS, COOKING_MODE_SUGGESTIONS } from '../../../constants/chatSuggestions';

function ChatContainer({ 
  showCookingGuide = false, 
  currentRecipe = null, 
  onStartCooking = () => {}, 
  onRecipeSearch = () => {},
  user = null,
  className = "" 
}) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useRecoilValue(userState);
  const currentUser = user || userInfo;

  // Custom hooks
  const {
    messages,
    messagesEndRef,
    addUserMessage,
    addAIMessage,
    addAIMessageWithRecipe
  } = useChatMessages(currentUser, showCookingGuide, currentRecipe);

  const {
    sendMessage,
    sendCookingQuestion,
    getCookingFallbackResponse
  } = useChatAPI();

  const { parseRecipeFromText } = useRecipeParsing();

  // Voice recognition handler
  const handleVoiceResult = useCallback((transcript, isFinal) => {
    console.log("음성 인식 결과:", transcript, isFinal ? "(최종)" : "(중간)");
    setInput(transcript);
    if (isFinal) {
      handleSubmit(null, transcript);
    }
  }, []);

  // Voice recognition hook
  const { 
    isListening, 
    speechSupported, 
    toggleListening 
  } = useVoiceRecognition(handleVoiceResult);

  // 레시피 관련 쿼리인지 확인하는 함수
  const isRecipeQuery = (text) => {
    const recipeKeywords = [
      '레시피', '요리', '만드는 법', '만들기', '조리법', '요리법',
      '끓이', '볶', '찌개', '반찬', '파스타', '음식', '메뉴', '추천'
    ];
    
    return recipeKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  // Message submit handler
  const handleSubmit = useCallback(async (e, voiceInput = null) => {
    e?.preventDefault();
    
    const submitInput = voiceInput || input;
    if (!submitInput.trim() || isLoading) return;

    addUserMessage(submitInput);
    setIsLoading(true);
    setInput('');
    
    // 레시피 관련 쿼리인지 확인하고 검색 상태 업데이트
    // 홈 화면에서만 로딩 UI를 표시하도록 조건 추가
    if (isRecipeQuery(submitInput) && onRecipeSearch && !showCookingGuide) {
      console.log("레시피 검색 감지:", submitInput);
      onRecipeSearch(true);
    }

    try {
      if (showCookingGuide && currentRecipe) {
        // Cooking guide mode - AI conversation
        try {
          const response = await sendCookingQuestion(submitInput, currentRecipe);
          
          addAIMessage(
            response.data.answer || '죄송합니다. 응답을 생성하는데 문제가 발생했습니다.',
            response.data.suggestions ? response.data.suggestions[0] : null
          );
        } catch (apiError) {
          console.error("요리 가이드 API 오류:", apiError);
          
          // Use fallback response on API error
          const fallbackResponse = getCookingFallbackResponse(submitInput, currentRecipe);
          addAIMessage(
            fallbackResponse,
            "AI 서비스에 일시적인 문제가 있어 기본 응답을 제공합니다."
          );
        }
      } else {
        // General mode
        const response = await sendMessage(submitInput);
        
        // Parse recipe if detected in response
        const parsedRecipe = parseRecipeFromText(response.data.answer || '');
        
        if (parsedRecipe) {
          addAIMessageWithRecipe(
            response.data.answer,
            parsedRecipe,
            response.data.suggestions ? response.data.suggestions[0] : null
          );
        } else {
          addAIMessage(
            response.data.answer || '응답을 생성하는데 문제가 발생했습니다.',
            response.data.suggestions ? response.data.suggestions[0] : null
          );
        }
      }
    } catch (error) {
      console.error('메시지 처리 오류:', error);
      addAIMessage(error.message || '요청 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      
      // 레시피 검색 완료 상태 업데이트 (약간의 지연 후)
      if (isRecipeQuery(submitInput) && onRecipeSearch && !showCookingGuide) {
        setTimeout(() => {
          onRecipeSearch(false);
        }, 1000);
      }
    }
  }, [
    input, 
    isLoading, 
    showCookingGuide, 
    currentRecipe, 
    addUserMessage, 
    addAIMessage, 
    addAIMessageWithRecipe,
    sendMessage,
    sendCookingQuestion,
    getCookingFallbackResponse,
    parseRecipeFromText,
    onRecipeSearch
  ]);

  // Recipe start handler
  const handleStartRecipe = useCallback((recipe) => {
    console.log("레시피 시작:", recipe);
    
    if (!recipe || !recipe.steps || !recipe.steps.length) {
      console.error("유효하지 않은 레시피:", recipe);
      return;
    }
    
    if (onStartCooking && typeof onStartCooking === 'function') {
      onStartCooking(recipe);
    } else {
      console.error("onStartCooking 함수가 없거나 함수가 아닙니다");
    }
  }, [onStartCooking]);

  // Select suggestions based on current mode
  const suggestions = showCookingGuide ? COOKING_MODE_SUGGESTIONS : GENERAL_SUGGESTIONS;
  const containerClasses = `${className} ${showCookingGuide ? "h-full" : ""}`;

  return (
    <div className={containerClasses}>
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
  onRecipeSearch: PropTypes.func,
  user: PropTypes.object,
  className: PropTypes.string
};

export default React.memo(ChatContainer);