// src/components/recipe/RecipeCard.jsx
import React from 'react';
import { apiService } from '../../api/apiServices';
import { useRecoilState } from 'recoil';
import { favoritesState } from '../../store/atoms';

function RecipeCard({ recipe, onStart }) {
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  const [isLoading, setIsLoading] = useState(false);
  
  const isFavorite = favorites.some(fav => fav.id === recipe.id);
  
  const handleToggleFavorite = async () => {
    setIsLoading(true);
    try {
      // API 호출
      const response = await apiService.user.toggleFavorite(recipe.id);
      
      // 로컬 상태 업데이트
      if (isFavorite) {
        setFavorites(prev => prev.filter(fav => fav.id !== recipe.id));
      } else {
        setFavorites(prev => [...prev, recipe]);
      }
    } catch (error) {
      console.error('즐겨찾기 처리 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
      <div className="flex justify-between items-start">
        <h3 className="font-bold">{recipe.title}</h3>
        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 px-2 py-0.5 rounded-full">
          {recipe.cookingTime}분
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button 
          onClick={() => onStart(recipe)}
          className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600"
          disabled={isLoading}
        >
          요리 시작하기
        </button>
        <button 
          onClick={handleToggleFavorite}
          className="flex items-center gap-1 px-3 py-1.5 border rounded-lg hover:bg-gray-50"
          disabled={isLoading}
        >
          <span className={`text-xl ${isFavorite ? 'text-yellow-400' : 'text-gray-400'}`}>
            {isFavorite ? '★' : '☆'}
          </span>
          <span>{isLoading ? '처리 중...' : (isFavorite ? '즐겨찾기 완료' : '즐겨찾기')}</span>
        </button>
      </div>
    </div>
  );
}

export default RecipeCard;