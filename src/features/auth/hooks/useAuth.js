// src/features/auth/hooks/useAuth.js
import { useState, useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../../../store/atoms';
import { authApi } from '../api/authApi';

/**
 * 인증 관련 기능을 제공하는 커스텀 훅
 * @returns {Object} 인증 관련 상태 및 기능
 */
export function useAuth() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // 로컬 스토리지에서 토큰을 확인하고 사용자 정보 로드
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAuthChecked(true);
        setInitializing(false);
        return;
      }
      
      try {
        // 토큰으로 사용자 프로필 조회
        const response = await authApi.getProfile();
        
        setUser({
          isLoggedIn: true,
          id: response.data.user.id,
          name: response.data.user.username,
          email: response.data.user.email,
          profileImage: response.data.user.profileImage || null,
          preferences: response.data.user.preferences || {
            spicyLevel: '보통',
            cookingTime: 30,
            vegetarian: false
          }
        });
      } catch (err) {
        // 토큰이 유효하지 않은 경우 로컬 스토리지 정리
        console.error('인증 확인 실패:', err);
        localStorage.removeItem('token');
        setUser({
          isLoggedIn: false,
          id: null,
          name: '',
          email: '',
          profileImage: null,
          preferences: {
            spicyLevel: '보통',
            cookingTime: 30,
            vegetarian: false
          }
        });
      } finally {
        setAuthChecked(true);
        setInitializing(false);
      }
    };
    
    checkAuth();
  }, [setUser]);

  /**
   * 로그인 함수
   * @param {Object} credentials - 로그인 정보
   * @param {string} credentials.email - 이메일
   * @param {string} credentials.password - 비밀번호
   * @param {boolean} credentials.rememberMe - 로그인 유지 여부
   * @returns {Promise} 로그인 결과
   */
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(credentials);
      
      // 토큰 저장
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      // 사용자 정보 상태 업데이트
      const userData = {
        isLoggedIn: true,
        id: response.data.user.id,
        name: response.data.user.username,
        email: response.data.user.email,
        profileImage: response.data.user.profileImage || null,
        preferences: response.data.user.preferences || {
          spicyLevel: '보통',
          cookingTime: 30,
          vegetarian: false
        }
      };
      
      setUser(userData);
      return userData;
    } catch (err) {
      // 오류 처리 및 상세 오류 메시지 생성
      console.error('로그인 실패:', err);
      
      const errorMessage = getErrorMessage(err, '로그인에 실패했습니다.');
      setError(errorMessage);
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  /**
   * 로그아웃 함수
   * @returns {Promise} 로그아웃 결과
   */
  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      // 서버에 로그아웃 요청
      try {
        await authApi.logout();
      } catch (err) {
        console.warn('서버 로그아웃 실패. 로컬에서 계속 진행:', err);
      }
      
      // 로컬 스토리지 정리
      localStorage.removeItem('token');
      
      // 사용자 상태 초기화
      setUser({
        isLoggedIn: false,
        id: null,
        name: '',
        email: '',
        profileImage: null,
        preferences: {
          spicyLevel: '보통',
          cookingTime: 30,
          vegetarian: false
        }
      });
      
      return true;
    } catch (err) {
      console.error('로그아웃 실패:', err);
      const errorMessage = getErrorMessage(err, '로그아웃에 실패했습니다.');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  /**
   * 회원가입 함수
   * @param {Object} userData - 회원가입 정보
   * @returns {Promise} 회원가입 결과
   */
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // 서버에 회원가입 요청
      const response = await authApi.register({
        email: userData.email,
        password: userData.password,
        username: userData.name || userData.username,
        phoneNumber: userData.phoneNumber,
        preferences: userData.preferences || {
          spicyLevel: '보통',
          cookingTime: 30,
          vegetarian: false
        }
      });
      
      // 자동 로그인 (선택적)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        const newUser = {
          isLoggedIn: true,
          id: response.data.user.id,
          name: response.data.user.username,
          email: response.data.user.email,
          preferences: response.data.user.preferences || userData.preferences
        };
        
        setUser(newUser);
        return newUser;
      }
      
      return response.data;
    } catch (err) {
      console.error('회원가입 실패:', err);
      
      const errorMessage = getErrorMessage(err, '회원가입에 실패했습니다.');
      setError(errorMessage);
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  /**
   * 비밀번호 재설정 요청 함수
   * @param {string} email - 이메일 주소
   * @returns {Promise} 비밀번호 재설정 요청 결과
   */
  const requestPasswordReset = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      await authApi.resetPassword(email);
      return true;
    } catch (err) {
      console.error('비밀번호 재설정 요청 실패:', err);
      
      const errorMessage = getErrorMessage(err, '비밀번호 재설정 요청에 실패했습니다.');
      setError(errorMessage);
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 비밀번호 변경 함수
   * @param {Object} passwordData - 비밀번호 변경 정보
   * @param {string} passwordData.currentPassword - 현재 비밀번호
   * @param {string} passwordData.newPassword - 새 비밀번호
   * @returns {Promise} 비밀번호 변경 결과
   */
  const changePassword = useCallback(async (passwordData) => {
    setLoading(true);
    setError(null);
    
    try {
      await authApi.changePassword(passwordData);
      return true;
    } catch (err) {
      console.error('비밀번호 변경 실패:', err);
      
      const errorMessage = getErrorMessage(err, '비밀번호 변경에 실패했습니다.');
      setError(errorMessage);
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 오류 메시지 생성 함수
   * @param {Error} error - 에러 객체
   * @param {string} defaultMessage - 기본 에러 메시지
   * @returns {string} 적절한 에러 메시지
   */
  const getErrorMessage = (error, defaultMessage) => {
    if (error.response) {
      // 서버에서 응답이 온 경우
      const { status, data } = error.response;
      
      // 특정 상태 코드에 따른 메시지
      if (status === 401) {
        return '이메일 또는 비밀번호가 올바르지 않습니다';
      } else if (status === 409) {
        return '이미 사용 중인 이메일입니다';
      } else if (data && data.message) {
        return data.message;
      }
    }
    
    return error.message || defaultMessage;
  };

  return {
    user,
    loading,
    initializing,
    error,
    authChecked,
    login,
    logout,
    register,
    requestPasswordReset,
    changePassword
  };
}

export default useAuth;