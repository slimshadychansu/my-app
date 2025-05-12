// src/services/recipeGuideService.js
import api from '../utils/api';
import { ENDPOINTS } from '../api/endpoints';

const recipeGuideService = {
  // API를 통해 레시피 가이드 가져오기
  getRecipeGuide: async (query) => {
    try {
      // 1. 쿼리가 비어있거나 잘못된 형식인지 확인
      if (!query || query.trim().length < 2 || query.includes('[') || query.includes(']')) {
        console.warn('잘못된 쿼리 형식:', query);
        
        // 로컬 스토리지에서 마지막 성공 쿼리 가져오기
        const lastSuccessfulQuery = localStorage.getItem('lastSuccessfulRecipeQuery');
        if (lastSuccessfulQuery) {
          console.info('마지막 성공 쿼리 사용:', lastSuccessfulQuery);
          query = lastSuccessfulQuery;
        } else {
          // 기본 쿼리 설정
          query = '인기 레시피 추천';
          console.info('기본 쿼리 사용:', query);
        }
      }
      
      // 2. 쿼리 파라미터 명확히 전달
      const response = await api.get(ENDPOINTS.RECIPES.GUIDE, {
        params: { 
          query: query.trim() // 확실히 공백 제거
        }
      });
      
      // 3. 응답 처리
      if (response.data && response.data.data) {
        const recipeData = response.data.data;
        
        // 4. 성공한 쿼리 저장
        if (query && query.trim().length > 2) {
          localStorage.setItem('lastSuccessfulRecipeQuery', query.trim());
        }
        
        // 레시피 단계 데이터 포맷팅
        const formattedSteps = recipeData.steps.map(step => ({
          ...step,
          stepNumber: step.stepNumber,
          instruction: step.instruction,
          stepIngredients: step.stepIngredients || [],
          timer: step.timerMinutes * 60 // 분을 초로 변환
        }));
        
        return {
          title: recipeData.title || '레시피 가이드',
          ingredients: recipeData.ingredients || [],
          steps: formattedSteps,
          totalTime: recipeData.totalTimeMinutes || 0,
          executionTime: recipeData.executionTime,
          originalResponse: recipeData.originalResponse,
          consistencyWarning: recipeData.consistencyWarning // 백엔드에서 제공하는 불일치 경고 표시
        };
      }
      return null;
    } catch (error) {
      console.error('레시피 가이드 API 오류:', error);
      throw error;
    }
  },
  
  // 사용자의 즐겨찾기 레시피 저장
  saveFavoriteRecipe: async (recipeId) => {
    try {
      const response = await api.post(ENDPOINTS.RECIPES.FAVORITES, { recipeId });
      return response.data;
    } catch (error) {
      console.error('즐겨찾기 저장 오류:', error);
      throw error;
    }
  },
  
  // 레시피 평점 가져오기
  getRecipeRatings: async (recipeId) => {
    try {
      const response = await api.get(`${ENDPOINTS.RECIPES.RATINGS}/${recipeId}`);
      return response.data;
    } catch (error) {
      console.error('레시피 평점 가져오기 오류:', error);
      throw error;
    }
  },
  
  // 레시피 평점 제출하기
  submitRating: async (recipeId, rating, comment) => {
    try {
      const response = await api.post(`${ENDPOINTS.RECIPES.RATINGS}/${recipeId}`, {
        rating,
        comment
      });
      return response.data;
    } catch (error) {
      console.error('레시피 평점 제출 오류:', error);
      throw error;
    }
  },
  
  // 사용자 검색 기록 가져오기
  getSearchHistory: () => {
    try {
      const history = localStorage.getItem('recipeSearchHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('검색 기록 가져오기 오류:', error);
      return [];
    }
  },
  
  // 검색 기록에 새 쿼리 추가
  addToSearchHistory: (query) => {
    try {
      if (!query || query.trim().length < 2) return;
      
      const history = recipeGuideService.getSearchHistory();
      const trimmedQuery = query.trim();
      
      // 중복 검색어 제거
      const updatedHistory = [
        trimmedQuery,
        ...history.filter(item => item !== trimmedQuery)
      ].slice(0, 10); // 최대 10개 기록 유지
      
      localStorage.setItem('recipeSearchHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('검색 기록 저장 오류:', error);
    }
  }
};

export default recipeGuideService;