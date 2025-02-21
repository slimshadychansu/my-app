// src/pages/Home.jsx
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from '../store/atoms'

function Home() {
  const user = useRecoilValue(userState)
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: '안녕하세요! 오늘은 어떤 요리를 도와드릴까요?',
      suggestion: '예시: "간단한 저녁 메뉴 추천해줘" 또는 "남은 재료로 만들 수 있는 요리 알려줘"'
    }
  ])
  const [input, setInput] = useState('')

  return (
    // dark: 로 시작하는 클래스들이 다크모드에서 적용될 스타일입니다
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">달그락</h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
          {user.name 
            ? `${user.name}님, 오늘은 어떤 요리를 해볼까요?`
            : '당신만을 위한 AI 요리 어시스턴트'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
        <div className="chat-messages min-h-[300px] mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {messages.map((message, index) => (
            <div 
              key={index}
              className="ai-message bg-blue-50 dark:bg-blue-900 p-3 rounded-lg mb-4 max-w-[80%]"
            >
              <p className="dark:text-white">{message.content}</p>
              {message.suggestion && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {message.suggestion}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="예) 오늘은 파스타를 만들고 싶어요"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                     dark:bg-gray-700 dark:text-white dark:border-gray-600 
                     dark:placeholder-gray-400"
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg 
                           transition-colors dark:bg-blue-600 dark:hover:bg-blue-700">
            전송
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home