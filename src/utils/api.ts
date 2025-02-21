// src/utils/api.ts
import axios from 'axios'

// 1. axios 인스턴스 생성
const api = axios.create({
  baseURL: 'API_기본_주소',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 2. 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('인증이 필요합니다')
          break
        case 404:
          console.log('요청한 리소스를 찾을 수 없습니다')
          break
        default:
          console.log('서버 에러가 발생했습니다')
      }
    } else if (error.request) {
      console.log('서버에서 응답이 오지 않습니다')
    } else {
      console.log('요청 설정 중 에러가 발생했습니다')
    }
    return Promise.reject(error)
  }
)

// 3. API 함수들 정의
export const apiService = {
  recipes: {
    getAll: () => api.get('/recipes'),
    getById: (id: string) => api.get(`/recipes/${id}`),
    getRecommendation: (preferences: any) => 
      api.post('/recipes/recommend', preferences)
  },

  user: {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data: any) => api.put('/user/profile', data),
    savePreferences: (preferences: any) => 
      api.post('/user/preferences', preferences)
  },

  chat: {
    sendMessage: (message: string) => 
      api.post('/chat/message', { message }),
    getHistory: () => api.get('/chat/history')
  }
}

export default api