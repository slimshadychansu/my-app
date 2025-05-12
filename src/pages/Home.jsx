// src/pages/Home.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../store/atoms';

import WelcomeHeader from '../features/home/components/WelcomeHeader';
import UserProfileBadge from '../features/home/components/UserProfileBadge';
import ChatContainer from '../features/chat/components/ChatContainer';
import CookingGuideContainer from '../features/cooking/CookingGuideContainer';
import RecipeListContainer from "../features/recipe/components/RecipeListContainer";
import RecipeLoadingUI from '../features/recipe/components/RecipeLoadingUI';
import CompletionModal from '../components/modals/CompletionModal';
import ErrorAlert from '../components/common/ErrorAlert';

function Home() {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  
  // 메인 UI 상태
  const [showCookingGuide, setShowCookingGuide] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [error, setError] = useState(null);
  const [isSearchingRecipe, setIsSearchingRecipe] = useState(false);
  
  // 레시피 검색 요청 감지
  const handleRecipeSearch = useCallback((isSearching) => {
    console.log("레시피 검색 상태 변경:", isSearching);
    setIsSearchingRecipe(isSearching);
    
    // 실제 환경에서는 API 응답 완료 시 false로 설정
    if (isSearching) {
      // 검색 결과를 위한 시간을 시뮬레이션 (실제로는 API 응답 후 처리)
      setTimeout(() => {
        setIsSearchingRecipe(false);
      }, 3000);
    }
  }, []);
  
  // 요리 가이드 시작 핸들러
  const handleStartCookingGuide = (recipe) => {
    console.log("Home에서 받은 레시피:", recipe);
    
    if (!recipe) {
      console.error("레시피가 정의되지 않았습니다.");
      alert("레시피 정보가 없습니다. 다른 레시피를 시도해보세요.");
      return;
    }
    
    // 레시피 구조 유효성 검사 및 빈 값 채우기
    const validatedRecipe = validateAndFixRecipe(recipe);
    
    setCurrentRecipe(validatedRecipe);
    setShowCookingGuide(true);
  };
  
  // 레시피 유효성 검사 및 빈 값 채우기 함수
  const validateAndFixRecipe = (recipe) => {
    // 깊은 복사를 통해 새 객체 생성 (원본 변경 방지)
    const validRecipe = JSON.parse(JSON.stringify(recipe));
    
    // 필수 필드 확인 및 기본값 설정
    validRecipe.title = validRecipe.title || "요리 가이드";
    validRecipe.cookingTime = validRecipe.cookingTime || 30;
    validRecipe.id = validRecipe.id || Date.now();
    validRecipe.recipeId = validRecipe.recipeId || Date.now();
    
    // 재료 필드 확인
    validRecipe.ingredients = validRecipe.ingredients || [];
    
    // 단계 필드 확인 및 처리
    if (!validRecipe.steps || !Array.isArray(validRecipe.steps) || validRecipe.steps.length === 0) {
      console.warn("레시피에 단계가 없거나 올바르지 않습니다. 기본 단계를 생성합니다.");
      validRecipe.steps = [
        {
          instruction: "요리를 시작합니다. AI가 제안한 방법으로 진행해보세요.",
          timer: 10,
          stepNumber: 1
        }
      ];
    } else {
      // 각 단계에 필수 속성이 있는지 확인
      validRecipe.steps = validRecipe.steps.map((step, index) => ({
        instruction: step.instruction || `단계 ${index + 1}`,
        timer: step.timer || 5,
        stepNumber: step.stepNumber || (index + 1)
      }));
    }
    
    console.log("검증 완료된 레시피:", validRecipe);
    return validRecipe;
  };
  
  // 요리 가이드 종료 핸들러
  const handleCloseCookingGuide = () => {
    setShowCookingGuide(false);
    setCurrentRecipe(null);
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

  return (
    <div className="max-w-6xl mx-auto px-4 pb-10">
      {/* 헤더 영역 */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold text-blue-500">
          <span className="text-blue-600">달</span>
          <span className="text-purple-500">그락</span>
        </h1>
        <p className="mt-2 text-gray-600">당신만을 위한 AI 요리 어시스턴트</p>
      </div>
      
      {/* 레시피 검색 중일 때만 로딩 UI 표시 (헤더와 채팅 사이) */}
      {isSearchingRecipe && (
        <div className="mb-4">
          {/* 높이와 패딩을 줄인 컴팩트한 버전으로 렌더링 */}
          <div className="h-32 md:h-40">
            <RecipeLoadingUI compact={true} />
          </div>
        </div>
      )}
      
      {/* 에러 표시 */}
      {error && <ErrorAlert message={error} />}
      
      {/* 사용자 프로필 */}
      {user.name && !showCookingGuide && (
        <UserProfileBadge user={user} />
      )}
      
      {/* 요리 가이드 모드 또는 일반 모드 컨텐츠 */}
      {showCookingGuide && currentRecipe ? (
        // 요리 가이드 모드
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <ChatContainer 
              showCookingGuide={true}
              currentRecipe={currentRecipe}
              user={user}
              onRecipeSearch={handleRecipeSearch}
            />
          </div>
          <div className="lg:col-span-2">
            <CookingGuideContainer
              recipe={currentRecipe}
              onComplete={handleCompleteRecipe}
              onClose={handleCloseCookingGuide}
            />
          </div>
        </div>
      ) : (
        // 일반 모드 (홈 화면)
        <>
          <ChatContainer 
            showCookingGuide={false}
            currentRecipe={null}
            onStartCooking={handleStartCookingGuide}
            onRecipeSearch={handleRecipeSearch}
            user={user}
          />
          
          {/* 레시피 목록 */}
          <RecipeListContainer 
            onStartCooking={handleStartCookingGuide}
            showCookingGuide={false}
          />
        </>
      )}
      
      {/* 완료 모달 */}
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