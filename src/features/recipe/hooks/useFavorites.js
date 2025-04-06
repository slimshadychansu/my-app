// src/features/recipe/hooks/useFavorites.js
import { useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { favoritesState, userState } from '../../../store/atoms';
import { apiService } from '../../../api/apiServices';

export function useFavorites() {
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  const [animatingFavorite, setAnimatingFavorite] = useState(null);
  
  // 즐겨찾기 토글 핸들러
  const toggleFavorite = useCallback(async (recipe) => {
    // 애니메이션 효과 트리거
    setAnimatingFavorite(recipe.title);
    setTimeout(() => setAnimatingFavorite(null), 800);
    
    try {
      // API 호출로 즐겨찾기 토글
      await apiService.recipes.toggleFavorite(recipe.id || recipe.recipeId);
      
      // 로컬 상태 업데이트
      setFavorites(prev => {
        const exists = prev.find(item => item.title === recipe.title);
        
        if (exists) {
          return prev.filter(item => item.title !== recipe.title);
        }
        return [...prev, recipe];
      });
    } catch (error) {
      console.error('즐겨찾기 처리 중 오류:', error);
      alert('즐겨찾기 처리 중 오류가 발생했습니다.');
    }
  }, [setFavorites]);
  
  // 즐겨찾기 여부 확인
  const isFavorite = useCallback((recipe) => {
    return favorites.some(fav => 
      (fav.id === recipe.id) || (fav.recipeId === recipe.recipeId) || (fav.title === recipe.title)
    );
  }, [favorites]);
  
  return {
    favorites,
    toggleFavorite,
    isFavorite,
    animatingFavorite
  };
}