// src/features/recipe/RecipeListContainer.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { useFavorites } from '../hooks/useFavorites';
import { useRecoilValue } from 'recoil';
import { userState } from "../../../store/atoms";  
import RecipeCard from "../../../components/recipe/RecipeCard";  // 상대 경로 수정
import LoadingSpinner from "../../../components/common/LoadingSpinner";  // 상대 경로 수정
import ErrorAlert from "../../../components/common/ErrorAlert";

function RecipeListContainer({ onStartCooking, showCookingGuide }) {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const { recipes, isLoading, error } = useRecipes();
  const { toggleFavorite, isFavorite, animatingFavorite } = useFavorites();
  
  // 요리 가이드 모드이거나 레시피가 없으면 렌더링하지 않음
  if (showCookingGuide || recipes.length === 0) {
    return null;
  }
  
  // 즐겨찾기 토글 시 로그인 필요 확인
  const handleToggleFavorite = (recipe) => {
    if (!user.isLoggedIn) {
      alert('즐겨찾기 기능은 로그인 후 이용 가능합니다.');
      navigate('/login');
      return;
    }
    
    toggleFavorite(recipe);
  };
  
  return (
    <div className="mt-8">
      {isLoading && <LoadingSpinner />}
      {error && <ErrorAlert message={error} />}
      
      {!isLoading && recipes.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4 dark:text-white">추천 레시피</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id || recipe.recipeId}
                recipe={recipe}
                onStart={() => onStartCooking(recipe)}
                onFavorite={() => handleToggleFavorite(recipe)}
                isFavorite={isFavorite(recipe)}
                isAnimating={animatingFavorite === recipe.title}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default React.memo(RecipeListContainer);