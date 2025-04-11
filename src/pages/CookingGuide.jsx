import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatContainer from '../features/chat/components/ChatContainer';
import CookingGuideContainer from '../features/cooking/CookingGuideContainer';

function CookingGuide() {
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [isAiChatMode, setIsAiChatMode] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 레시피 데이터 검증 및 초기화
  useEffect(() => {
    if (location.state?.recipe) {
      setCurrentRecipe(location.state.recipe);
    } else {
      // 레시피가 없는 경우 홈페이지로 리디렉션
      navigate('/', { 
        state: { 
          message: '요리 가이드를 시작할 레시피가 없습니다.' 
        } 
      });
    }
  }, [location.state, navigate]);

  // 요리 시작 핸들러
  const handleStartCooking = useCallback((recipe) => {
    setCurrentRecipe(recipe);
    setIsAiChatMode(false);
  }, []);

  // 채팅 모드로 돌아가기
  const handleReturnToChat = useCallback(() => {
    setCurrentRecipe(null);
    setIsAiChatMode(true);
  }, []);

  // 요리 완료 핸들러
  const handleCookingComplete = useCallback(() => {
    navigate('/favorites', { 
      state: { 
        rateRecipe: currentRecipe 
      } 
    });
  }, [navigate, currentRecipe]);

  // 레시피가 없는 경우 null 반환
  if (!currentRecipe && !isAiChatMode) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl mx-auto p-4">
      {isAiChatMode ? (
        <ChatContainer 
          showCookingGuide={false}
          onStartCooking={handleStartCooking}
          currentRecipe={currentRecipe}
        />
      ) : (
        <CookingGuideContainer 
          recipe={currentRecipe}
          onComplete={handleCookingComplete}
          onClose={handleReturnToChat}
        />
      )}
    </div>
  );
}

export default CookingGuide;