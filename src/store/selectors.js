// // src/store/selectors.ts
// import { selector } from 'recoil'
// import { currentRecipeState, userState } from './atoms'

// // 현재 레시피의 남은 시간을 계산하는 selector
// export const remainingTimeSelector = selector({
//   key: 'remainingTimeSelector',
//   get: ({get}) => {
//     const recipe = get(currentRecipeState)
//     const activeTimers = recipe.timers.filter(timer => timer.isRunning)
    
//     if (activeTimers.length === 0) return 0
//     return Math.max(...activeTimers.map(timer => timer.remainingTime))
//   }
// })

// // 사용자 취향에 맞는 레시피를 필터링하는 selector
// export const recommendedRecipesSelector = selector({
//   key: 'recommendedRecipesSelector',
//   get: ({get}) => {
//     const user = get(userState)
//     // 여기에 실제 레시피 필터링 로직이 들어갈 예정입니다
//   }
// })