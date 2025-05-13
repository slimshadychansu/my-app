// src/features/chat/components/ChatContainer.jsx
import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../store/atoms';
import { useVoiceRecognition } from '../../../hooks/useVoiceRecognition';
import ChatInterface from '../../../components/chat/ChatInterface';
import { GENERAL_SUGGESTIONS, COOKING_MODE_SUGGESTIONS } from '../../../constants/chatSuggestions';
import useMessageState from '../hooks/useMessageState';
import useChatAPI from '../hooks/useChatAPI';
import useRecipeParsing from '../hooks/useRecipeParsing';
import { isRecipeQuery, validateRecipe } from '../utils/chatUtils';

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

  // 커스텀 훅 사용
  const {
    messages,
    messagesEndRef,
    addUserMessage,
    addAIMessage,
    addAIMessageWithRecipe,
    addAIErrorMessage
  } = useMessageState(currentUser, showCookingGuide, currentRecipe);

  const {
    sendMessage,
    sendCookingQuestion,
    getCookingFallbackResponse
  } = useChatAPI();

  const { parseRecipeFromText } = useRecipeParsing();

  // 음성 인식 결과 핸들러
  const handleVoiceResult = useCallback((transcript, isFinal) => {
    setInput(transcript);
    if (isFinal) {
      handleSubmit(null, transcript);
    }
  }, []);

  // 음성 인식 훅 사용
  const { 
    isListening, 
    speechSupported, 
    toggleListening 
  } = useVoiceRecognition(handleVoiceResult);

  // 메시지 제출 핸들러
  const handleSubmit = useCallback(async (e, voiceInput = null) => {
    e?.preventDefault();
    
    const submitInput = voiceInput || input;
    if (!submitInput.trim() || isLoading) return;

    addUserMessage(submitInput);
    setIsLoading(true);
    setInput('');
    
    // 레시피 검색 상태 업데이트
    if (isRecipeQuery(submitInput) && onRecipeSearch && !showCookingGuide) {
      onRecipeSearch(true);
    }

    try {
      if (showCookingGuide && currentRecipe) {
        // 요리 가이드 모드 질문 처리
        try {
          const response = await sendCookingQuestion(submitInput, currentRecipe);
          
          addAIMessage(
            response.data.answer || '죄송합니다. 응답을 생성하는데 문제가 발생했습니다.',
            response.data.suggestions ? response.data.suggestions[0] : null
          );
        } catch (apiError) {
          console.error("요리 가이드 API 오류:", apiError);
          
          // 오류 시 폴백 응답 사용
          const fallbackResponse = getCookingFallbackResponse(submitInput, currentRecipe);
          addAIMessage(
            fallbackResponse,
            "AI 서비스에 일시적인 문제가 있어 기본 응답을 제공합니다."
          );
        }
      } else {
        // 일반 모드 질문 처리
        const response = await sendMessage(submitInput);
        
        // 응답에서 레시피 파싱 시도
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
      addAIErrorMessage(error.message || '요청 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      
      // 레시피 검색 완료 상태 업데이트
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
    addAIErrorMessage,
    sendMessage,
    sendCookingQuestion,
    getCookingFallbackResponse,
    parseRecipeFromText,
    onRecipeSearch
  ]);

  // 레시피 시작 핸들러
  const handleStartRecipe = useCallback((recipe) => {
    const validatedRecipe = validateRecipe(recipe);
    if (!validatedRecipe) {
      console.error("유효하지 않은 레시피:", recipe);
      return;
    }
    
    if (onStartCooking && typeof onStartCooking === 'function') {
      onStartCooking(validatedRecipe);
    } else {
      console.error("onStartCooking 함수가 없거나 함수가 아닙니다");
    }
  }, [onStartCooking]);

  // 사용할 제안 선택
  const suggestions = useMemo(() => 
    showCookingGuide ? COOKING_MODE_SUGGESTIONS : GENERAL_SUGGESTIONS, 
    [showCookingGuide]
  );
  
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