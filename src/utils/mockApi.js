import MockAdapter from 'axios-mock-adapter'
import dummyRecipes from '../data/dummyRecipes.js'

// 엔드포인트 직접 정의
const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile'
  },
  RECIPES: {
    LIST: '/recipes',
    DETAIL: (id) => `/recipes/${id}`,
    RECOMMEND: '/recipes/recommend',
    FAVORITE: '/recipes/favorites'
  },
  CHAT: {
    SEND: '/chat/message',
    HISTORY: '/chat/history'
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
  }
}

export const setupMockApi = (apiInstance) => {
  const mock = new MockAdapter(apiInstance, { 
    delayResponse: 800,
    onNoMatch: 'passthrough' // 모킹되지 않은 요청은 실제 서버로 전달
  })
  
  // 레시피 목록 API 모킹
  mock.onGet(ENDPOINTS.RECIPES.LIST).reply(200, {
    data: dummyRecipes,
    message: '레시피 목록을 성공적으로 불러왔습니다.'
  })
  
  // 특정 레시피 조회 API 모킹
  mock.onGet(new RegExp(`${ENDPOINTS.RECIPES.LIST}/\\w+`)).reply((config) => {
    const id = config.url.split('/').pop()
    const recipe = dummyRecipes.find(recipe => recipe.id === id)
    
    if (recipe) {
      return [200, { data: recipe, message: '레시피를 불러왔습니다.' }]
    }
    return [404, { message: '레시피를 찾을 수 없습니다.' }]
  })
  
  // 레시피 추천 API 모킹
  mock.onPost(ENDPOINTS.RECIPES.RECOMMEND).reply(200, {
    data: dummyRecipes.slice(0, 2),
    message: '추천 레시피를 불러왔습니다.'
  })
  
  // 즐겨찾기 API 모킹
  mock.onPost(ENDPOINTS.RECIPES.FAVORITE).reply(200, {
    success: true,
    message: '즐겨찾기가 토글되었습니다.'
  })
  
  mock.onGet(ENDPOINTS.RECIPES.FAVORITE).reply(200, {
    data: dummyRecipes.slice(0, 2),
    message: '즐겨찾기 목록을 불러왔습니다.'
  })
  
  // 로그인 API 모킹
  mock.onPost(ENDPOINTS.AUTH.LOGIN).reply((config) => {
    const { email, password } = JSON.parse(config.data)
    
    if (email && password) {
      return [200, {
        token: 'mock-jwt-token',
        user: {
          id: 'user123',
          name: '테스트 사용자',
          email: email,
          preferences: {
            spicyLevel: '보통',
            cookingTime: 30,
            vegetarian: false
          }
        }
      }]
    }
    
    return [401, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' }]
  })
  
  // 회원가입 API 모킹
  mock.onPost(ENDPOINTS.AUTH.REGISTER).reply((config) => {
    const userData = JSON.parse(config.data)
    
    if (userData.email && userData.password && userData.name) {
      return [201, {
        token: 'mock-jwt-token',
        user: {
          id: `user_${Date.now()}`,
          name: userData.name,
          email: userData.email,
          preferences: userData.preferences || {
            spicyLevel: '보통',
            cookingTime: 30,
            vegetarian: false
          }
        }
      }]
    }
    
    return [400, { message: '모든 필수 항목을 입력해주세요.' }]
  })
  
  // 프로필 조회 API 모킹
  mock.onGet(ENDPOINTS.AUTH.PROFILE).reply(200, {
    user: {
      id: 'user123',
      name: '테스트 사용자',
      email: 'test@example.com',
      preferences: {
        spicyLevel: '보통',
        cookingTime: 30,
        vegetarian: false
      }
    }
  })
  
  // 채팅 메시지 전송 API 모킹
  mock.onPost(ENDPOINTS.CHAT.SEND).reply((config) => {
    const { message } = JSON.parse(config.data)
    
    let response = {
      message: '죄송합니다. 이해하지 못했습니다.',
      suggestion: '다른 질문을 해보세요.'
    }
    
    if (message.includes('레시피') || message.includes('요리')) {
      response = {
        message: '오늘은 토마토 파스타를 추천드립니다. 간단하고 맛있는 요리입니다!',
        suggestion: '다른 요리를 추천해드릴까요?'
      }
    } else if (message.includes('안녕') || message.includes('반가워')) {
      response = {
        message: '안녕하세요! 요리에 관해 무엇을 도와드릴까요?',
        suggestion: '레시피 추천이나 요리 팁을 물어보세요.'
      }
    }
    
    return [200, response]
  })
  
  // 채팅 이력 API 모킹
  mock.onGet(ENDPOINTS.CHAT.HISTORY).reply(200, {
    messages: [
      { type: 'ai', content: '안녕하세요! 요리에 관해 무엇을 도와드릴까요?' },
      { type: 'user', content: '간단한 저녁 메뉴 추천해주세요' },
      { type: 'ai', content: '오늘은 토마토 파스타를 추천드립니다. 간단하고 맛있는 요리입니다!' }
    ]
  })

  console.log('목업 API가 정상적으로 설정되었습니다')
  return mock
}