// src/features/home/api/recipeApi.js
import api from '../../../utils/api';

export const recipeApi = {
  /**
   * 추천 레시피 목록 조회
   * @returns {Promise} 추천 레시피 목록
   */
  getRecommendedRecipes: async () => {
    try {
      const response = await api.get('/recipes/recommended');
      return response.data;
    } catch (error) {
      console.error('추천 레시피 로드 실패:', error);
      throw error;
    }
  },

  /**
   * 사용자 취향 기반 레시피 추천
   * @param {Object} preferences - 사용자 취향 데이터
   * @returns {Promise} 맞춤 레시피 목록
   */
  getPersonalizedRecipes: async (preferences) => {
    try {
      const response = await api.post('/recipes/personalized', preferences);
      return response.data;
    } catch (error) {
      console.error('맞춤 레시피 로드 실패:', error);
      throw error;
    }
  },

  /**
   * 특정 레시피 상세 정보 조회
   * @param {string} recipeId - 레시피 ID
   * @returns {Promise} 레시피 상세 정보
   */
  getRecipeDetails: async (recipeId) => {
    try {
      const response = await api.get(`/recipes/${recipeId}`);
      return response.data;
    } catch (error) {
      console.error('레시피 상세 정보 로드 실패:', error);
      throw error;
    }
  }
};