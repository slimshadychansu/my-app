// src/features/board/components/RecipeDetailsForm.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * 레시피 정보 입력 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} props.recipeDetails - 레시피 상세 정보
 * @param {Function} props.onCookingTimeChange - 조리 시간 변경 핸들러
 * @param {Function} props.onDifficultyChange - 난이도 변경 핸들러
 * @param {Function} props.onIngredientChange - 재료 정보 변경 핸들러
 * @param {Function} props.onAddIngredient - 재료 추가 핸들러
 * @param {Function} props.onRemoveIngredient - 재료 삭제 핸들러
 */
function RecipeDetailsForm({
  recipeDetails = {
    cookingTime: 30,
    difficulty: '보통',
    ingredients: [{ name: '', amount: '' }]
  },
  onCookingTimeChange = () => {},
  onDifficultyChange = () => {},
  onIngredientChange = () => {},
  onAddIngredient = () => {},
  onRemoveIngredient = () => {}
}) {
  // 안전한 재료 배열 확보
  const ingredients = recipeDetails?.ingredients || [{ name: '', amount: '' }];

  return (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <h3 className="font-semibold mb-3 dark:text-white">레시피 정보</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* 조리 시간 */}
        <div>
          <label className="block mb-1 text-sm dark:text-gray-300">조리 시간 (분)</label>
          <input
            type="number"
            min="1"
            max="180"
            value={recipeDetails?.cookingTime || 30}
            onChange={(e) => onCookingTimeChange(parseInt(e.target.value, 10) || 30)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        {/* 난이도 */}
        <div>
          <label className="block mb-1 text-sm dark:text-gray-300">난이도</label>
          <select
            value={recipeDetails?.difficulty || '보통'}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="쉬움">쉬움</option>
            <option value="보통">보통</option>
            <option value="어려움">어려움</option>
          </select>
        </div>
      </div>
      
      {/* 재료 */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm dark:text-gray-300">재료</label>
          <button
            type="button"
            onClick={onAddIngredient}
            className="text-blue-500 text-sm hover:text-blue-600"
          >
            + 재료 추가
          </button>
        </div>
        
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={ingredient.name || ''}
              onChange={(e) => onIngredientChange(index, 'name', e.target.value)}
              placeholder="재료명"
              className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="text"
              value={ingredient.amount || ''}
              onChange={(e) => onIngredientChange(index, 'amount', e.target.value)}
              placeholder="수량"
              className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="button"
              onClick={() => onRemoveIngredient(index)}
              disabled={ingredients.length <= 1}
              className={`px-2 ${
                ingredients.length <= 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-red-500 hover:text-red-600'
              }`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      
      {/* 요리 팁 */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">요리 팁:</span> 요리 방법과 상세한 팁은 아래 내용 입력란에 작성해주세요.
        </p>
      </div>
    </div>
  );
}

RecipeDetailsForm.propTypes = {
  recipeDetails: PropTypes.shape({
    cookingTime: PropTypes.number,
    difficulty: PropTypes.string,
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        amount: PropTypes.string
      })
    )
  }),
  onCookingTimeChange: PropTypes.func,
  onDifficultyChange: PropTypes.func,
  onIngredientChange: PropTypes.func,
  onAddIngredient: PropTypes.func,
  onRemoveIngredient: PropTypes.func
};

export default RecipeDetailsForm;