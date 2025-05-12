// src/features/chat/hooks/useChatAPI.js
import { useCallback } from 'react';
import chatApi from '../api/chatApi';

export function useChatAPI() {
  const sendMessage = useCallback(async (input) => {
    try {
      const response = await chatApi.askAI(input);
      
      // 성공한 요청의 경우 로컬 스토리지에 저장
      if (response.success && input.trim().length > 2) {
        localStorage.setItem('lastSuccessfulRecipeQuery', input.trim());
      }
      
      return response;
    } catch (error) {
      console.error('AI 메시지 전송 오류:', error);
      throw error;
    }
  }, []);

  const sendCookingQuestion = useCallback(async (input, currentRecipe) => {
    try {
      const response = await chatApi.askCookingQuestion(input, currentRecipe);
      return response;
    } catch (error) {
      console.error('요리 질문 전송 오류:', error);
      throw error;
    }
  }, []);

  const getCookingFallbackResponse = useCallback((query, recipe) => {
    const lowerQuery = query.toLowerCase();
    const currentStepNum = (recipe.currentStep || 0) + 1;
    const currentStep = recipe.steps?.[recipe.currentStep || 0];
    
    if (lowerQuery.includes('지금') || lowerQuery.includes('현재') || lowerQuery.includes('이 단계')) {
      if (currentStep) {
        return `현재 ${currentStepNum}단계: "${currentStep.instruction}"을 진행 중이시네요. 이 단계에서 구체적으로 어떤 부분이 궁금하신가요?`;
      }
    }
    
    if (lowerQuery.includes('대체') || lowerQuery.includes('재료')) {
      return `${recipe.title}에서 재료를 대체할 때는 비슷한 식감과 맛을 가진 것을 선택하는 것이 좋습니다. 구체적으로 어떤 재료를 대체하고 싶으신가요?`;
    }
    else if (lowerQuery.includes('소금') || lowerQuery.includes('간')) {
      return `${recipe.title}에는 전체 재료의 1~2% 정도의 소금이 적당합니다. 조금씩 넣어가며 맛을 보는 것이 좋아요.`;
    }
    else if (lowerQuery.includes('보관') || lowerQuery.includes('저장')) {
      return `${recipe.title}는 완전히 식힌 후 밀폐 용기에 담아 냉장 보관하시면 2~3일 정도 맛있게 드실 수 있습니다.`;
    }
    else if (lowerQuery.includes('온도') || lowerQuery.includes('불')) {
      return `일반적으로 ${recipe.title}는 중간 불(160-180도)에서 조리하는 것이 좋습니다. 재료가 타지 않도록 주의하면서 조리해주세요.`;
    }
    else if (lowerQuery.includes('시간') || lowerQuery.includes('얼마나')) {
      if (currentStep?.timer) {
        return `현재 단계의 권장 시간은 ${currentStep.timer}분입니다. 재료의 상태를 보면서 시간을 조절해주세요.`;
      }
      return `전체 조리 시간은 약 ${recipe.cookingTime || '30'}분 정도 소요됩니다. 단계별로 적절한 시간을 지켜주세요.`;
    }
    else {
      return `요리 중에 도움이 필요하시군요! ${recipe.title} 요리에 대해 더 구체적인 질문이 있으시면 알려주세요. 현재 ${currentStepNum}/${recipe.steps?.length || 1}단계를 진행 중입니다.`;
    }
  }, []);

  return {
    sendMessage,
    sendCookingQuestion,
    getCookingFallbackResponse
  };
}