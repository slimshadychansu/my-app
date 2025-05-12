// src/utils/api.js (업데이트된 버전)
import axios from 'axios'

const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = isDevelopment ? '' : import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000, // AI 응답 처리를 위해 타임아웃 시간 증가
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터 (디버깅 및 토큰 설정)
api.interceptors.request.use(
  (config) => {
    console.log('요청 URL:', config.url)
    console.log('기본 URL:', config.baseURL)

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${encodeURIComponent(token)}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('전체 에러 객체:', {
      ...error,
      customMessage: '요청 중 오류가 발생했습니다.'
    })
    
    if (error.response) {
      console.error('응답 데이터:', error.response.data)
      console.error('상태 코드:', error.response.status)
      console.error('헤더:', error.response.headers)
    }

    return Promise.reject(error)
  }
)

// 디버깅을 위한 API 서비스 정의
export const apiService = {
  chat: {
    askAI: (message) => {
      console.log('AI에게 질문:', message);
      return api.post('/api/chat/ask', {
        sender: localStorage.getItem('username') || 'user',
        message: message
      });
    }
  }
  // 다른 API 서비스들...
}

export default api