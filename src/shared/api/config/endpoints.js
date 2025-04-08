export const ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/signup',
      PROFILE: '/auth/profile',
      LOGOUT: '/auth/logout'
    },
    RECIPES: {
      LIST: '/recipes',
      DETAIL: (id) => `/recipes/${id}`,
      RECOMMEND: '/recipes/recommend',
      FAVORITE: '/recipes/favorites',
      RATE: (id) => `/recipes/${id}/rate`
    },
    BOARD: {
      LIST: '/board',
      DETAIL: (id) => `/board/${id}`,
      CREATE: '/board',
      UPDATE: (id) => `/board/${id}`,
      DELETE: (id) => `/board/${id}`
    },
    COMMENTS: {
      LIST: (postId) => `/comments/${postId}`,
      CREATE: '/comments',
      DELETE: (id) => `/comments/${id}`
    },
    CHAT: {
      SEND: '/chat/send',
      HISTORY: '/chat/history'
    },
    USER: {
      PROFILE: '/users/profile',
      PREFERENCES: '/users/preferences'
    }
  };