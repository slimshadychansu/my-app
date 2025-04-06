// src/features/home/api/chatApi.js
import api from '../../../utils/api';

export const chatApi = {
  /**
   * AI 채팅 메시지 전송
   * @param {string} message - 사용자 메시지
   * @returns {Promise} AI 응답 데이터
   */
  sendMessage: async (message) => {
    try {
      const response = await api.post('/chat/send', { message });
      return response.data;
    } catch (error) {
      console.error('채팅 메시지 전송 실패:', error);
      throw error;
    }
  },

  /**
   * 사용자 취향 기반 레시피 추천
   * @param {Object} preferences - 사용자 취향 데이터
   * @returns {Promise} 추천 레시피 목록
   */
  getRecommendation: async (preferences) => {
    try {
      const response = await api.post('/recipes/recommend', preferences);
      return response.data;
    } catch (error) {
      console.error('레시피 추천 실패:', error);
      throw error;
    }
  },

  /**
   * 채팅 기록 조회
   * @returns {Promise} 채팅 기록 데이터
   */
  getChatHistory: async () => {
    try {
      const response = await api.get('/chat/history');
      return response.data;
    } catch (error) {
      console.error('채팅 기록 로드 실패:', error);
      throw error;
    }
  }
};