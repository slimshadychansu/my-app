// src/components/common/Card.jsx
import React from 'react'

function Card({ children, variant = 'default', className = '', onClick, hoverable = false }) {
  // 카드의 기본 스타일을 정의합니다
  const baseStyles = `
    bg-white
    rounded-lg
    shadow-sm
    overflow-hidden
    transition-all
    duration-200
  `

  // 카드 유형별 스타일을 정의합니다
  const variantStyles = {
    default: 'p-4',
    recipe: 'p-0',  // 레시피 카드는 이미지가 있어서 패딩이 다릅니다
    review: 'p-6 border border-gray-100'
  }

  // 호버 효과 스타일을 정의합니다
  const hoverStyles = hoverable ? 'hover:shadow-md hover:-translate-y-1' : ''

  // 클릭 가능한 경우의 스타일을 정의합니다
  const clickableStyles = onClick ? 'cursor-pointer' : ''

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${hoverStyles}
        ${clickableStyles}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// 레시피 카드 컴포넌트
// components/common/Card.jsx
// RecipeCard 컴포넌트 수정
export function RecipeCard({ title, description, cookingTime, difficulty, imageUrl, onClick }) {
  return (
    <Card variant="recipe" hoverable onClick={onClick}>
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            이미지 준비중
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg md:text-xl font-semibold mb-2 line-clamp-1">{title}</h3>
        <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 text-sm md:text-base text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded">⏱️ {cookingTime}분</span>
          <span className="bg-gray-100 px-2 py-1 rounded">난이도: {difficulty}</span>
        </div>
      </div>
    </Card>
  )
}

export default Card