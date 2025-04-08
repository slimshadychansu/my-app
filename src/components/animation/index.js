// src/components/animations/index.js
import React, { useState, useEffect } from 'react';
import './styles/animations.css';

// 애니메이션 버튼 컴포넌트
export function AnimatedButton({ children, onClick, className, variant = 'primary', disabled = false }) {
  const baseClass = "px-4 py-2 rounded-lg transition-all duration-300 hover-lift click-effect";
  
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseClass} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

// 로딩 스피너 컴포넌트
export function LoadingSpinner({ size = 'md', color = 'blue' }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };
  
  const colorClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    gray: "border-gray-500"
  };
  
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-rotate`}></div>
    </div>
  );
}

// 알림 메시지 컴포넌트
export function Notification({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  return isVisible ? (
    <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white animate-slideInRight ${typeClasses[type]}`}>
      {message}
    </div>
  ) : null;
}

// 별점 애니메이션 컴포넌트
export function AnimatedStarRating({ rating, setRating, readOnly = false }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readOnly && setRating(star)}
          disabled={readOnly}
          className={`text-2xl focus:outline-none transition-transform duration-200 ${readOnly ? 'cursor-default' : ''}`}
          style={{ transform: star <= rating ? 'scale(1.2)' : 'scale(1)' }}
        >
          <span 
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

// 타이핑 애니메이션 (로딩 중 표시)
export function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

// 애니메이션이 있는 레시피 카드
export function AnimatedRecipeCard({ recipe, onClick, className }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover-lift animate-fadeIn ${className}`}
    >
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 dark:text-white">{recipe.title}</h3>
        
        {recipe.rating && (
          <div className="flex text-yellow-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < recipe.rating ? '★' : '☆'}
              </span>
            ))}
          </div>
        )}
        
        {recipe.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
            {recipe.description}
          </p>
        )}
        
        {recipe.tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {recipe.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-100"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 폭죽 애니메이션 (요리 완료 축하)
export function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {Array.from({ length: 50 }).map((_, i) => {
            const size = Math.random() * 8 + 5;
            const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const animDuration = 0.5 + Math.random() * 1;
            const animDelay = Math.random() * 0.5;
            
            return (
              <div
                key={i}
                className="absolute animate-zoomIn"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '50%',
                  backgroundColor: color,
                  animationDuration: `${animDuration}s`,
                  animationDelay: `${animDelay}s`,
                  opacity: 0
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 페이드인 애니메이션이 있는 텍스트
export function FadeInText({ children, delay = 0, className }) {
  return (
    <div 
      className={`animate-fadeIn ${className}`} 
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// 페이드인 & 슬라이드업 애니메이션 컴포넌트
export function AnimatedContainer({ children, className, animation = 'fadeIn', delay = 0 }) {
  const animationClasses = {
    fadeIn: 'animate-fadeIn',
    slideUp: 'animate-slideUp',
    slideInLeft: 'animate-slideInLeft',
    slideInRight: 'animate-slideInRight',
    zoomIn: 'animate-zoomIn'
  };
  
  return (
    <div 
      className={`${animationClasses[animation]} ${className}`} 
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}