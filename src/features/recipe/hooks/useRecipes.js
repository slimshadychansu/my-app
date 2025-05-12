// src/features/recipe/hooks/useRecipes.js
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../store/atoms';
import { apiService } from '../../../api/apiServices';

export function useRecipes() {
  const user = useRecoilValue(userState);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  
  // 전체 레시피 가져오기
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError(null);
      
      // 인증 토큰 존재 여부 확인 (문제 진단용)
      const token = localStorage.getItem('token');
      console.log('인증 토큰 존재 여부:', !!token);
      if (token) {
        console.log('토큰 첫 10자:', token.substring(0, 10) + '...');
      }
      
      try {
        // API 요청 헤더 및 설정 확인
        console.log('API 요청 시작:', {
          url: '/api/recipes', 
          method: 'GET',
          headers: apiService.getDefaultHeaders && apiService.getDefaultHeaders()
        });
        
        // API 호출로 레시피 데이터 가져오기
        const response = await apiService.recipes.getAll();
        console.log('레시피 API 응답:', response);
        
        if (response && response.data) {
          console.log('레시피 데이터 구조:', response.data);
          setRecipes(response.data);
        } else {
          console.warn('예상치 못한 API 응답 구조:', response);
          setError('서버에서 예상치 못한 형식의 데이터가 반환되었습니다.');
        }
      } catch (err) {
        console.error('레시피 데이터 로드 중 오류 발생:', err);
        
        if (err.response) {
          console.error('서버 응답 상태:', err.response.status);
          console.error('서버 응답 데이터:', err.response.data);
          
          // 상태 코드별 처리
          if (err.response.status === 401) {
            setError('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
          } else if (err.response.status === 403) {
            setError('접근 권한이 없습니다. 관리자에게 문의하세요.');
          } else if (err.response.status === 404) {
            setError('요청한 데이터를 찾을 수 없습니다.');
          } else {
            setError(`서버 오류가 발생했습니다 (${err.response.status}).`);
          }
        } else if (err.request) {
          console.error('요청 후 응답 없음:', err.request);
          setError('서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
          console.error('요청 설정 오류:', err.message);
          setError('요청 설정 중 오류가 발생했습니다: ' + err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipes();
  }, []);
  
  // 추천 레시피 가져오기 (사용자 취향 기반)
  useEffect(() => {
    const fetchRecommendedRecipes = async () => {
      // 로그인 상태와 선호도 확인
      if (user.isLoggedIn && user.preferences) {
        try {
          console.log('추천 레시피 요청:', {
            preferences: user.preferences
          });
          
          const response = await apiService.recipes.getRecommendation(user.preferences);
          console.log('추천 레시피 응답:', response);
          
          // 데이터 검증 후 상태 업데이트
          if (response && response.data) {
            setRecommendedRecipes(response.data);
          } else {
            console.warn('예상치 못한 추천 레시피 응답:', response);
          }
        } catch (err) {
          console.error('추천 레시피 로드 중 오류 발생:', err);
          // 오류 상세 내용 추가
          console.error('오류 세부 정보:', err.response || err.request || err.message);
        }
      }
    };
  
    fetchRecommendedRecipes();
  }, [user.isLoggedIn, user.preferences]);
  
  return {
    recipes,
    recommendedRecipes,
    isLoading,
    error
  };
}