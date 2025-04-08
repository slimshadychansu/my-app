// src/api/endpoints.js
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/users/signup',
    PROFILE: '/api/users/profile',
  },
  RECIPES: {
    LIST: '/api/recipes',
    DETAIL: (id) => `/api/recipes/${id}`,
    RECOMMEND: '/api/recipes/recommend',
    FAVORITE: '/api/favorites',
    GUIDE: '/api/ai/recipe-steps',
  },
  BOARD: {
    LIST: '/api/community',
    DETAIL: (id) => `/api/community/${id}`,
    CREATE: '/api/community',
    UPDATE: (id) => `/api/community/${id}`,
    DELETE: (id) => `/api/community/${id}`,
  },
  COMMENTS: {
    LIST: (postId) => `/api/comments/${postId}`,
    CREATE: '/api/comments',
    DELETE: (id) => `/api/comments/${id}`,
  },
  CHAT: {
    SEND: '/api/chat/send',
    HISTORY: '/api/chat/history',
    ASK: '/api/chat/ask',
  },
};