// src/features/chat/api/chatApi.js
import api from '../../../utils/api';

export const chatApi = {
  /**
   * AI에게 질문하기 (메인 엔드포인트)
   */
  askAI: async (message, context = null) => {
    try {
      const payload = {
        message,
        sender: localStorage.getItem('username') || 'user',
        timestamp: new Date().toISOString()
      };

      // 컨텍스트가 있는 경우와 없는 경우를 구분
      if (context && context.type === 'cooking_guide') {
        // 요리 가이드 컨텍스트가 있는 경우
        const contextPayload = {
          message: payload.message,
          context: {
            recipeTitle: context.recipeContext.title,
            currentStep: context.recipeContext.currentStep || 1,
            totalSteps: context.recipeContext.ingredients ? context.recipeContext.ingredients.length : 0,
            recipeId: context.recipeContext.recipeId
          }
        };
        
        const response = await api.post('/api/chat/ask-with-context', contextPayload);
        
        return {
          success: true,
          data: {
            answer: response.data.answer || response.data.message || '',
            recipeDetected: response.data.recipeDetected || false,
            recipeGuide: response.data.recipeGuide || null,
            suggestions: response.data.suggestions || [],
            metadata: response.data.metadata || {}
          }
        };
      } else {
        // 일반 질문인 경우
        const response = await api.post('/api/chat/ask', payload);
        
        return {
          success: true,
          data: {
            answer: response.data.answer || response.data.message || '',
            recipeDetected: response.data.recipeDetected || false,
            recipeGuide: response.data.recipeGuide || null,
            suggestions: response.data.suggestions || [],
            metadata: response.data.metadata || {}
          }
        };
      }
    } catch (error) {
      console.error('AI 채팅 요청 실패:', error);
      
      if (error.response?.status === 500) {
        throw new Error('서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else if (error.response?.status === 404) {
        throw new Error('요청한 API 엔드포인트를 찾을 수 없습니다.');
      }
      
      throw new Error(error.response?.data?.message || '채팅 서비스 연결에 실패했습니다.');
    }
  },

  /**
   * 요리 가이드 모드에서 질문하기
   */
   askCookingQuestion: async (message, recipe) => {
    try {
      // 요리 컨텍스트를 포함한 요청 구성
      const contextRequest = {
        message: message,
        context: {
          recipeTitle: recipe.title,
          currentStep: recipe.currentStep || 1,
          totalSteps: recipe.steps ? recipe.steps.length : 0,
          recipeId: recipe.id || recipe.recipeId
        }
      };
      
      const response = await api.post('/api/chat/ask-with-context', contextRequest);
      
      return {
        success: true,
        data: {
          answer: response.data.answer || response.data.message || '',
          recipeDetected: response.data.recipeDetected || false,
          recipeGuide: response.data.recipeGuide || null,
          suggestions: response.data.suggestions || [],
          metadata: response.data.metadata || {}
        }
      };
    } catch (error) {
      console.error('요리 가이드 질문 처리 실패:', error);
      throw new Error('요리 관련 질문을 처리하는데 실패했습니다.');
    }
  },

  /**
   * 레시피 단계별 가이드 가져오기
   */
  getRecipeSteps: async (query) => {
    try {
      const response = await api.get('/api/ai/recipe-steps', {
        params: { query }
      });
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('레시피 가이드 요청 실패:', error);
      throw new Error('레시피 가이드를 가져오는데 실패했습니다.');
    }
  },

  /**
   * 재료 대체 추천받기
   */
  getIngredientSubstitute: async (ingredient) => {
    try {
      const response = await api.get('/api/ai/ingredient-substitute', {
        params: { ingredient }
      });
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('재료 대체 추천 실패:', error);
      throw new Error('재료 대체 추천을 가져오는데 실패했습니다.');
    }
  }
};

export default chatApi;