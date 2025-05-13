// src/features/chat/utils/chatUtils.js

/**
 * 텍스트가 레시피 관련 질문인지 확인합니다
 * @param {string} text - 분석할 텍스트
 * @returns {boolean} - 레시피 관련 질문인지 여부
 */
export function isRecipeQuery(text) {
  if (!text) return false;

  const recipeKeywords = [
    '레시피', '요리', '만드는 법', '만들기', '조리법', '요리법',
    '끓이', '볶', '찌개', '반찬', '파스타', '음식', '메뉴', '추천'
  ];
  
  return recipeKeywords.some(keyword => text.toLowerCase().includes(keyword));
}

/**
 * 레시피 객체의 유효성을 검사하고 필요시 기본값으로 보완합니다
 * @param {Object} recipe - 검사할 레시피 객체
 * @returns {Object} - 유효성이 보장된 레시피 객체
 */
export function validateRecipe(recipe) {
  if (!recipe) return null;
  
  if (!recipe.title || !recipe.steps || !Array.isArray(recipe.steps) || recipe.steps.length === 0) {
    console.error("유효하지 않은 레시피 형식:", recipe);
    return null;
  }
  
  return recipe;
}

/**
 * 레시피 객체를 복사하여 필수 필드를 확인하고 보완합니다
 * @param {Object} recipe - 원본 레시피 객체
 * @returns {Object} - 보완된 레시피 객체
 */
export function sanitizeRecipe(recipe) {
  if (!recipe) return null;
  
  return {
    title: recipe.title || '레시피',
    steps: Array.isArray(recipe.steps) ? recipe.steps : [],
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    cookingTime: recipe.cookingTime || 30,
    id: recipe.id || Date.now(),
    recipeId: recipe.recipeId || Date.now()
  };
}