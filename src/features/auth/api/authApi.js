// src/features/auth/api/authApi.js
import api from '../../../utils/api';
import { ENDPOINTS } from '../../../api/endpoints';

/**
 * 인증 관련 API 함수 모음
 */
export const authApi = {
  /**
   * 회원가입
   * @param {Object} userData - 사용자 등록 정보
   * @param {string} userData.email - 이메일
   * @param {string} userData.password - 비밀번호
   * @param {string} userData.username - 사용자 이름
   * @param {Object} userData.preferences - 사용자 취향 정보 (선택적)
   * @returns {Promise} 회원가입 응답 데이터
   */
  register: async (userData) => {
    try {
      const response = await api.post('/api/users/signup', userData);
      return response;
    } catch (error) {
      // 에러 발생 시 추가 디버깅 정보
      console.error('회원가입 API 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // 중복 이메일 에러 처리
      if (error.response?.status === 409) {
        const enhancedError = new Error('이미 등록된 이메일입니다.');
        enhancedError.code = 'EMAIL_EXISTS';
        throw enhancedError;
      }
      
      // 입력값 검증 에러
      if (error.response?.status === 400) {
        const enhancedError = new Error(error.response.data.message || '입력 정보를 확인해주세요.');
        enhancedError.fieldErrors = error.response.data.errors || {};
        throw enhancedError;
      }
      console.log('회원가입 API에러:',error)
      throw error;
    }
  },

  /**
   * 로그인
   * @param {Object} credentials - 로그인 자격 증명
   * @param {string} credentials.email - 이메일
   * @param {string} credentials.password - 비밀번호
   * @param {boolean} credentials.rememberMe - 로그인 유지 여부 (선택적)
   * @returns {Promise} 로그인 응답 데이터
   */
  login: async (credentials) => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
      return response;
    } catch (error) {
      console.error('로그인 API 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // 인증 실패 에러
      if (error.response?.status === 401) {
        const enhancedError = new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
        enhancedError.code = 'INVALID_CREDENTIALS';
        throw enhancedError;
      }
      
      // 계정 잠금 에러
      if (error.response?.status === 423) {
        const enhancedError = new Error('계정이 잠겼습니다. 관리자에게 문의하세요.');
        enhancedError.code = 'ACCOUNT_LOCKED';
        throw enhancedError;
      }
      
      throw error;
    }
  },

  /**
   * 로그아웃
   * @returns {Promise} 로그아웃 응답 데이터
   */
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response;
    } catch (error) {
      console.error('로그아웃 API 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      throw error;
    }
  },

  /**
   * 비밀번호 재설정 요청
   * @param {string} email - 사용자 이메일
   * @returns {Promise} 비밀번호 재설정 요청 응답 데이터
   */
  resetPassword: async (email) => {
    try {
      const response = await api.post('/auth/reset-password', { email });
      return response;
    } catch (error) {
      console.error('비밀번호 재설정 요청 API 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // 계정 없음 에러
      if (error.response?.status === 404) {
        const enhancedError = new Error('등록되지 않은 이메일입니다.');
        enhancedError.code = 'EMAIL_NOT_FOUND';
        throw enhancedError;
      }
      
      throw error;
    }
  },

  /**
   * 비밀번호 재설정 완료
   * @param {Object} resetData - 비밀번호 재설정 데이터
   * @param {string} resetData.token - 재설정 토큰
   * @param {string} resetData.newPassword - 새 비밀번호
   * @returns {Promise} 비밀번호 재설정 완료 응답 데이터
   */
  completePasswordReset: async (resetData) => {
    try {
      const response = await api.post('/auth/reset-password/complete', resetData);
      return response;
    } catch (error) {
      console.error('비밀번호 재설정 완료 API 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // 토큰 만료 에러
      if (error.response?.status === 400) {
        const enhancedError = new Error('유효하지 않거나 만료된 토큰입니다.');
        enhancedError.code = 'INVALID_TOKEN';
        throw enhancedError;
      }
      
      throw error;
    }
  },

  /**
   * 사용자 프로필 조회
   * @returns {Promise} 사용자 프로필 데이터
   */
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response;
    } catch (error) {
      console.error('사용자 프로필 조회 API 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // 인증 만료 에러
      if (error.response?.status === 401) {
        const enhancedError = new Error('로그인 세션이 만료되었습니다.');
        enhancedError.code = 'SESSION_EXPIRED';
        throw enhancedError;
      }
      
      throw error;
    }
  },

  /**
   * 비밀번호 변경
   * @param {Object} passwordData - 비밀번호 변경 정보
   * @param {string} passwordData.currentPassword - 현재 비밀번호
   * @param {string} passwordData.newPassword - 새 비밀번호
   * @returns {Promise} 비밀번호 변경 응답 데이터
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response;
    } catch (error) {
      console.error('비밀번호 변경 API 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // 현재 비밀번호 불일치 에러
      if (error.response?.status === 400) {
        const enhancedError = new Error('현재 비밀번호가 일치하지 않습니다.');
        enhancedError.code = 'INVALID_CURRENT_PASSWORD';
        throw enhancedError;
      }
      
      throw error;
    }
  },

  /**
   * 이메일 중복 확인
   * @param {string} email - 확인할 이메일
   * @returns {Promise} 이메일 중복 확인 응답 데이터
   */
  checkEmailAvailability: async (email) => {
    try {
      const response = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
      return response;
    } catch (error) {
      console.error('이메일 중복 확인 API 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 409) {
        const enhancedError = new Error('이미 사용 중인 이메일입니다.');
        enhancedError.code = 'EMAIL_EXISTS';
        throw enhancedError;
      }
      
      throw error;
    }
  }
};

// 기본 내보내기
export default authApi;