// src/components/common/Button.js
import React from 'react'

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  isLoading = false, 
  disabled = false,
  onClick,
  fullWidth = false 
}) {
  // 버튼의 기본 스타일을 설정합니다
  const baseStyles = 'rounded-md font-medium transition-colors duration-200'
  
  // 크기별 스타일을 정의합니다
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  }

  // 종류별 스타일을 정의합니다
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }

  // 비활성화 상태의 스타일을 정의합니다
  const disabledStyles = 'opacity-50 cursor-not-allowed'

  // 너비 스타일을 정의합니다
  const widthStyles = fullWidth ? 'w-full' : ''

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${disabled || isLoading ? disabledStyles : ''}
        ${widthStyles}
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
          로딩 중...
        </div>
      ) : children}
    </button>
  )
}

export default Button