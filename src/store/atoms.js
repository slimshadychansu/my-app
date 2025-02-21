// src/store/atoms.js에 favoritesState를 추가했는지 확인해볼게요:
import { atom } from 'recoil'

// 사용자 상태를 관리하는 atom
export const userState = atom({
 key: 'userState',
 default: {
   isLoggedIn: false,
   name: '',
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

// 즐겨찾기 상태 추가
export const favoritesState = atom({
 key: 'favoritesState',
 default: []
})