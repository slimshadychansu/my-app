// src/api/apiServices.js 또는 .ts
import api from '../utils/api'
import { ENDPOINTS } from './endpoints'

// 각 서비스별 정의
export const authService = {
  login: (credentials) => api.post(ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => api.post(ENDPOINTS.AUTH.REGISTER, userData),
  getProfile: () => api.get(ENDPOINTS.AUTH.PROFILE)
}

export const recipeService = {
  getAll: () => api.get(ENDPOINTS.RECIPES.LIST),
  getById: (id) => api.get(ENDPOINTS.RECIPES.DETAIL(id)),
  getRecommendation: (preferences) => api.post(ENDPOINTS.RECIPES.RECOMMEND, preferences),
  toggleFavorite: (recipeId) => api.post(ENDPOINTS.RECIPES.FAVORITE, { recipeId }),
  getFavorites: () => api.get(ENDPOINTS.RECIPES.FAVORITE),
  getRecipeGuide: (query) => api.get(ENDPOINTS.RECIPES.GUIDE, { params: { query } })
}

export const boardService = {
  getAll: (params) => api.get(ENDPOINTS.BOARD.LIST, { params }),
  getById: (id) => api.get(ENDPOINTS.BOARD.DETAIL(id)),
  create: (postData) => api.post(ENDPOINTS.BOARD.CREATE, postData),
  update: (id, postData) => api.put(ENDPOINTS.BOARD.UPDATE(id), postData),
  delete: (id) => api.delete(ENDPOINTS.BOARD.DELETE(id))
}

export const commentService = {
  getByPostId: (postId) => api.get(ENDPOINTS.COMMENTS.LIST(postId)),
  create: (commentData) => api.post(ENDPOINTS.COMMENTS.CREATE, commentData),
  delete: (id) => api.delete(ENDPOINTS.COMMENTS.DELETE(id))
}

export const chatService = {
  // 단일 메서드로 통합
  askAI: (message) => api.post(ENDPOINTS.CHAT.ASK, {
    sender: localStorage.getItem('username') || 'user',
    message: message
  }),
  // 새 메서드 추가 - 확장된 응답 반환
  askAIEnhanced: (message) => api.post(ENDPOINTS.CHAT.ASK, {
    sender: localStorage.getItem('username') || 'user',
    message: message
  }),
  // 채팅 기록 조회 (필요한 경우)
  getHistory: () => api.get(ENDPOINTS.CHAT.HISTORY)

  
}

// apiService 객체 명확하게 정의
export const apiService = {
  auth: authService,
  recipes: recipeService,
  board: boardService,
  comments: commentService,
  chat: chatService
}

// 기본 내보내기 추가
export default apiService