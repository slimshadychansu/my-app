// src/utils/api.js (업데이트된 버전)
import axios from 'axios'

console.log('환경 변수 값:', import.meta.env.VITE_API_BASE_URL);

// 개발 환경에서는 상대 경로 사용 (프록시 활용)
const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = isDevelopment ? '' : import.meta.env.VITE_API_BASE_URL;

console.log('/api', API_BASE_URL);

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
    // 디버깅용 로그
    console.log('요청 URL:', config.url)
    console.log('기본 URL:', config.baseURL)

    // FormData를 사용하는 경우 Content-Type 헤더 제거
    if (config.data instanceof FormData) {
      console.log('FormData 객체 감지됨!');
      delete config.headers['Content-Type'];
      console.log('Content-Type 헤더 제거됨, 현재 헤더:', config.headers);
    }

    // 토큰이 있다면 Authorization 헤더에 추가 (인코딩 처리)
    const token = localStorage.getItem('token')
    if (token) {
      // 토큰 값을 encodeURIComponent로 인코딩하여 non-ASCII 문자 문제 해결
      config.headers.Authorization = `Bearer ${encodeURIComponent(token)}`
      
      // 디버깅용: 인코딩된 토큰 값 확인
      console.log('인코딩된 토큰:', encodeURIComponent(token))
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 상세 에러 로깅
    console.error('전체 에러 객체:', {
      ...error,
      customMessage: '요청 중 오류가 발생했습니다.'
    })
    
    if (error.response) {
      // 서버 응답이 있는 경우
      console.error('응답 데이터:', error.response.data)
      console.error('상태 코드:', error.response.status)
      console.error('헤더:', error.response.headers)

      // 상태 코드별 처리
      switch (error.response.status) {
        case 401:
          console.log('인증이 필요합니다')
          localStorage.removeItem('token')
          // 로그인 페이지로 리다이렉트 등의 처리 가능
          break
        case 404:
          console.log('요청한 리소스를 찾을 수 없습니다')
          break
        case 500:
          console.log('서버 오류가 발생했습니다')
          break
        default:
          console.log(`오류 발생: ${error.response.status}`)
      }
    } else if (error.request) {
      // 요청은 보냈으나 응답을 받지 못한 경우
      console.log('서버에서 응답이 오지 않습니다')
    } else {
      // 요청 설정 중 에러
      console.log('요청 설정 중 에러가 발생했습니다')
    }

    return Promise.reject(error)
  }
)

// API 서비스 정의
export const apiService = {
  // 레시피 관련 API
  recipes: {
    getAll: () => api.get('/recipes'),
    getById: (id) => api.get(`/recipes/${id}`),
    getRecommendation: (preferences) => api.post('/recipes/recommend', preferences),
    create: (recipeData) => api.post('/recipes', recipeData),
    update: (id, recipeData) => api.put(`/recipes/${id}`, recipeData),
    delete: (id) => api.delete(`/recipes/${id}`)
  },

  // 사용자 관련 API
  user: {
    getProfile: () => api.get('/users/{id}'),
    updateProfile: (data) => api.put('/users/{id}', data),
    savePreferences: (preferences) => api.post('/user/preferences', preferences) // 백엔드 설계 필요
  },

  // 채팅 관련 API
  chat: {
    // 기존 메시지 전송 함수 (이미지 업로드 지원)
    sendMessage: (messageData, imageFile) => {
      const formData = new FormData();
      
      // FormData 내용 디버깅
      console.log('메시지 데이터:', messageData);
      
      formData.append('message', JSON.stringify(messageData));
      
      if (imageFile) {
        formData.append('image', imageFile);
        console.log('이미지 추가됨:', imageFile.name);
      }
      
      // FormData 디버깅
      for (let pair of formData.entries()) {
        console.log('FormData 항목:', pair[0], ':', pair[1]);
      }
      
      // 인터셉터에서 이미 처리하므로 headers 옵션 제거
      return api.post('/chat/send', formData);
    },
    
    // 새로운 AI 챗봇 메시지 전송 함수 (JSON 형식)
    askAI: (message) => {
      console.log('AI에게 질문:', message);
      return api.post('/chat/ask', {
        sender: localStorage.getItem('username') || 'user',
        message: message
      });
    },
    
    getHistory: () => api.get('/chat/history')
  },

  // 인증 관련 API
  auth: {
    register: (userData) => api.post('/users/signup', {
      email: userData.email,
      password: userData.password,
      username: userData.name,
      phoneNumber: userData.phoneNumber || ''
    }),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.get('/users/logout')
  }
}

export default api