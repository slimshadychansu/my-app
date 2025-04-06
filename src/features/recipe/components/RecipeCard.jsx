// src/components/recipe/RecipeCard.jsx
import React from 'react';

function RecipeCard({ 
  recipe, 
  onStart, 
  onFavorite, 
  isFavorite, 
  isAnimating 
}) {
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
        >
          요리 시작하기
        </button>
        <button 
          onClick={() => onFavorite(recipe)}
          className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg hover:bg-gray-50 
            ${isAnimating ? 'animate-pulse' : ''}`}
        >
          <span className={`text-xl ${isFavorite ? 'text-yellow-400' : 'text-gray-400'}`}>
            {isFavorite ? '★' : '☆'}
          </span>
          <span>즐겨찾기{isFavorite ? ' 완료' : ''}</span>
        </button>
      </div>
    </div>
  );
}

export default React.memo(RecipeCard);