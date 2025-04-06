// src/features/user/api/userApi.js
import api from '../../../utils/api';

export const userApi = {
  /**
   * 사용자 프로필 조회
   * @returns {Promise} 사용자 프로필 데이터
   */
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('프로필 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 사용자 프로필 업데이트
   * @param {Object} profileData - 업데이트할 프로필 정보
   * @returns {Promise} 업데이트 결과 데이터
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      throw error;
    }
  },

  /**
   * 사용자 취향 정보 업데이트
   * @param {Object} preferences - 사용자 취향 정보
   * @returns {Promise} 업데이트 결과 데이터
   */
  updatePreferences: async (preferences) => {
    try {
      const response = await api.patch('/users/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('취향 정보 업데이트 실패:', error);
      throw error;
    }
  },

  /**
   * 리뷰 목록 조회
   * @returns {Promise} 사용자 리뷰 목록
   */
  getReviews: async () => {
    try {
      const response = await api.get('/users/reviews');
      return response.data;
    } catch (error) {
      console.error('리뷰 목록 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 즐겨찾기 목록 조회
   * @returns {Promise} 사용자 즐겨찾기 목록
   */
  getFavorites: async () => {
    try {
      const response = await api.get('/users/favorites');
      return response.data;
    } catch (error) {
      console.error('즐겨찾기 목록 조회 실패:', error);
      throw error;
    }
  }
};