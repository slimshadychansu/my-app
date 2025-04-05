import { atom } from 'recoil'//

// 사용자 상태를 관리하는 atom
export const userState = atom({
 key: 'userState',
 default: {
   isLoggedIn: false,
   id: null,
   name: '',
   email: '',
   profileImage: null, // 프로필 이미지 필드 추가
   preferences: {
     spicyLevel: '보통',
     cookingTime: 30,
     vegetarian: false
   }
 }
})

// 채팅 기록을 관리하는 atom
export const chatHistoryState = atom({
 key: 'chatHistoryState',
 default: []
})

// 현재 레시피 상태를 관리하는 atom
export const currentRecipeState = atom({
 key: 'currentRecipeState',
 default: {
   id: '',
   title: '',
   steps: [],
   currentStep: 0,
   timers: []
 }
})

// 즐겨찾기 상태
export const favoritesState = atom({
 key: 'favoritesState',
 default: []
})

// 공유 리뷰 상태
export const reviewsState = atom({
  key: 'reviewsState',
  default: []
})

// 다크모드 상태
export const darkModeState = atom({
  key: 'darkModeState',
  default: false
})