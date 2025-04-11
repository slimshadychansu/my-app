import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../store/atoms';
import ChatContainer from '../features/chat/components/ChatContainer';
import CookingGuideContainer from '../features/cooking/CookingGuideContainer';
import CompletionModal from '../components/modals/CompletionModal';

function CookingGuide() {
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useRecoilValue(userState);

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
  }, []);

  // 채팅 모드로 돌아가기
  const handleReturnToChat = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // 요리 완료 핸들러
  const handleCookingComplete = useCallback(() => {
    setShowCompletionModal(true);
  }, []);

  // 평가 페이지로 이동
  const handleRateRecipe = useCallback(() => {
    navigate('/favorites', { 
      state: { 
        rateRecipe: currentRecipe 
      } 
    });
  }, [navigate, currentRecipe]);

  // 레시피가 없는 경우 null 반환
  if (!currentRecipe) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 채팅 컴포넌트 - 큰 화면에서 1/3 차지 */}
        <div className="lg:col-span-1">
          <ChatContainer 
            showCookingGuide={true}
            currentRecipe={currentRecipe}
            onStartCooking={handleStartCooking}
            user={user}
          />
        </div>
        
        {/* 요리 가이드 컴포넌트 - 큰 화면에서 2/3 차지 */}
        <div className="lg:col-span-2">
          <CookingGuideContainer 
            recipe={currentRecipe}
            onComplete={handleCookingComplete}
            onClose={handleReturnToChat}
          />
        </div>
      </div>
      
      <CompletionModal 
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        recipeName={currentRecipe?.title}
        onRate={handleRateRecipe}
        onReturn={handleReturnToChat}
      />
    </div>
  );
}

export default CookingGuide;