// src/pages/Search.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { favoritesState } from '../store/atoms'

function Search() {
   const navigate = useNavigate()
   const [favorites, setFavorites] = useRecoilState(favoritesState)
   const [messages, setMessages] = useState([{
       type: 'ai',
       content: '안녕하세요! 어떤 요리에 대해 알고 싶으신가요? 레시피 검색, 요리 방법, 재료 활용법 등 무엇이든 물어보세요!'
   }])
   const [input, setInput] = useState('')

   // 즐겨찾기 추가/제거 함수
   const toggleFavorite = (recipe) => {
       setFavorites(prev => {
           const exists = prev.find(item => item.title === recipe.title)
           if (exists) {
               return prev.filter(item => item.title !== recipe.title)
           } else {
               return [...prev, recipe]
           }
       })
   }

   const handleSubmit = (e) => {
       e.preventDefault()
       if (!input.trim()) return

       // 사용자 메시지 추가
       setMessages(prev => [...prev, 
           { type: 'user', content: input }
       ])

       // AI 응답 시뮬레이션 (나중에 실제 AI 응답으로 대체)
       const mockRecipe = {
           title: '라면',
           steps: [
               {
                   instruction: '물을 500ml 받고 3분동안 끓여주세요',
                   timer: 180  // 3분을 초 단위로
               },
               {
                   instruction: '면과 스프를 넣고 4분 30초간 더 끓여주세요',
                   timer: 270  // 4분 30초를 초 단위로
               },
               {
                   instruction: '완성되었습니다! 맛있게 드세요',
                   timer: null
               }
           ]
       }

       // AI 응답 후 가이드 페이지로 이동 버튼 표시
       setMessages(prev => [...prev, {
           type: 'ai',
           content: (
               <div>
                   <p>레시피를 찾았습니다! {mockRecipe.title}의 조리법을 알려드릴게요.</p>
                   <div className="flex gap-2 mt-2">
                       <button 
                           onClick={() => navigate('/guide', { state: { recipe: mockRecipe }})}
                           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                       >
                           요리 시작하기
                       </button>
                       <button 
                           onClick={() => toggleFavorite(mockRecipe)}
                           className="flex items-center gap-1 px-4 py-2 border rounded hover:bg-gray-50"
                       >
                           {favorites.find(item => item.title === mockRecipe.title) 
                               ? '★ 즐겨찾기 완료' 
                               : '☆ 즐겨찾기'}
                       </button>
                   </div>
               </div>
           )
       }])

       setInput('')
   }

   return (
       <div className="max-w-4xl mx-auto p-4">
           <div className="bg-white rounded-lg shadow-lg p-4 min-h-[500px] flex flex-col">
               <div className="flex-1 overflow-y-auto mb-4">
                   {messages.map((msg, idx) => (
                       <div key={idx} 
                            className={`mb-4 ${
                                msg.type === 'ai' 
                                    ? 'bg-blue-50 rounded-br-lg rounded-bl-lg rounded-tr-lg' 
                                    : 'bg-gray-50 rounded-bl-lg rounded-tl-lg rounded-tr-lg ml-auto'
                            } p-4 max-w-[80%] ${
                                msg.type === 'user' ? 'ml-auto' : ''
                            }`}>
                           {msg.content}
                       </div>
                   ))}
               </div>

               <form onSubmit={handleSubmit} className="mt-4">
                   <div className="flex gap-2">
                       <input
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="요리나 재료에 대해 검색해보세요 (예: 김치찌개 레시피, 남은 양파 활용법)"
                       />
                       <button 
                           type="submit"
                           className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                       >
                           검색
                       </button>
                   </div>
               </form>
           </div>
       </div>
   )
}

export default Search