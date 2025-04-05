// src/features/home/api/homeApi.js
import api from '../../../utils/api';

export const homeApi = {
  /**
   * 홈 화면 초기 데이터 로드
   * @returns {Promise} 홈 화면 초기 데이터
   */
  getInitialData: async () => {
    try {
      const response = await api.get('/home/initial');
      return response.data;
    } catch (error) {
      console.error('홈 화면 초기 데이터 로드 실패:', error);
      throw error;
    }
  }
};