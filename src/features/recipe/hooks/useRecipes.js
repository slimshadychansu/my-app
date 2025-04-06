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
      
      try {
        // API 호출로 레시피 데이터 가져오기
        const response = await apiService.recipes.getAll();
        setRecipes(response.data);
      } catch (err) {
        console.error('레시피 데이터 로드 중 오류 발생:', err);
        setError('레시피를 불러오는 중 문제가 발생했습니다.');
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
          const response = await apiService.recipes.getRecommendation(user.preferences);
          // 추천 레시피 상태 업데이트
          setRecommendedRecipes(response.data);
        } catch (err) {
          console.error('추천 레시피 로드 중 오류 발생:', err);
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