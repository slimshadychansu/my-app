// src/pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../store/atoms';

import WelcomeHeader from '../features/home/components/WelcomeHeader';
import UserProfileBadge from '../features/home/components/UserProfileBadge';
import ChatContainer from '../features/chat/components/ChatContainer';
import CookingGuideContainer from '../features/cooking/CookingGuideContainer';
import RecipeListContainer from "../features/recipe/components/RecipeListContainer";
import CompletionModal from '../components/modals/CompletionModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';

function Home() {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  
  // 메인 UI 상태
  const [showCookingGuide, setShowCookingGuide] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 요리 가이드 시작 핸들러
  const handleStartCookingGuide = (recipe) => {
    setCurrentRecipe(recipe);
    setShowCookingGuide(true);
  };
  
  // 요리 가이드 종료 핸들러
  const handleCloseCookingGuide = () => {
    setShowCookingGuide(false);
  };
  
  // 요리 완료 핸들러
  const handleCompleteRecipe = () => {
    setShowCompletionModal(true);
  };
  
  // 평가 페이지로 이동
  const goToRatePage = () => {
    if (!currentRecipe || !currentRecipe.title) {
      alert("레시피 정보가 누락되었습니다. 홈으로 이동합니다.");
      handleCloseCookingGuide();
      return;
    }
    
    navigate('/favorites', { 
      state: { 
        rateRecipe: currentRecipe 
      } 
    });
  };

  // 현재 모드에 따라 다른 컴포넌트 렌더링
  const renderMainContent = () => {
    if (showCookingGuide && currentRecipe) {
      return (
        <CookingGuideContainer
          recipe={currentRecipe}
          onComplete={handleCompleteRecipe}
          onClose={handleCloseCookingGuide}
        />
      );
    }
    
    return (
      <>
        <ChatContainer 
          showCookingGuide={showCookingGuide}
          currentRecipe={currentRecipe}
          user={user}
        />
        
        <RecipeListContainer 
          onStartCooking={handleStartCookingGuide}
          showCookingGuide={showCookingGuide}
        />
      </>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-10">
      <WelcomeHeader user={user} />
      
      {user.name && !showCookingGuide && (
        <UserProfileBadge user={user} />
      )}
      
      {isLoading && <LoadingSpinner />}
      {error && <ErrorAlert message={error} />}
      
      {renderMainContent()}
      
      <CompletionModal 
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        recipeName={currentRecipe?.title}
        onRate={goToRatePage}
        onReturn={handleCloseCookingGuide}
      />
    </div>
  );
}

export default Home;