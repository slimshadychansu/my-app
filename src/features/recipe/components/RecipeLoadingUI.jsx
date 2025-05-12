// src/features/recipe/components/RecipeLoadingUI.jsx
import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import PropTypes from 'prop-types';

const RecipeLoadingUI = ({ compact = false }) => {
  const [loadingText, setLoadingText] = useState('맛있는 레시피를 찾고 있어요');
  const [dots, setDots] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [foodEmojis, setFoodEmojis] = useState([]);

  // 로딩 텍스트와 진행 상태 업데이트
  useEffect(() => {
    // 로딩 텍스트에 점 추가하는 애니메이션
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 500);

    // 로딩 상태 업데이트
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          // 100%에 도달하면 안내 메시지 변경
          setLoadingText('레시피 준비 완료! 잠시만 기다려주세요');
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 300);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // 랜덤 음식 이모지 생성 및 배치
  useEffect(() => {
    const emojis = ['🍲', '🍕', '🍜', '🍚', '🍗', '🍖', '🧀', '🥗', '🍱', '🍤', '🫕', '🌮', '🍔', '🍠', '🥩'];
    const newEmojis = [];

    // compact 모드에서는 더 적은 이모지 사용
    const emojiCount = compact ? 6 : 12;

    for (let i = 0; i < emojiCount; i++) {
      newEmojis.push({
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 90 + 5, // 화면의 5-95% 범위 내에 위치
        y: Math.random() * 80 + 10, // 화면의 10-90% 범위 내에 위치
        size: (Math.random() * (compact ? 1.0 : 1.5)) + (compact ? 0.7 : 1), // 크기 조정
        opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8 투명도
      });
    }

    setFoodEmojis(newEmojis);
  }, [compact]);

  // 로딩 팁 메시지 (compact 모드에서는 표시하지 않음)
  const loadingTips = [
    "재료는 요리 전에 미리 준비해두면 요리 시간을 단축할 수 있어요",
    "소금은 요리 마지막에 넣으면 간을 더 정확히 맞출 수 있어요",
    "뜨거운 팬에 찬물을 넣으면 팬이 변형될 수 있으니 주의하세요",
    "마늘은 너무 오래 볶으면 쓴맛이 날 수 있어요",
    "채소는 방금 자른 것이 가장 신선하고 맛있어요"
  ];
  
  const randomTipIndex = Math.floor(Math.random() * loadingTips.length);

  // 컴팩트 모드 여부에 따라 높이 클래스 결정
  const containerHeightClass = compact ? "h-full" : "h-64 md:h-96";
  const iconSize = compact ? 32 : 48;
  const iconContainerSize = compact ? "w-12 h-12" : "w-20 h-20";

  return (
    <div className={`relative w-full ${containerHeightClass} bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md overflow-hidden`}>
      {/* 배경 이모지 */}
      {foodEmojis.map((item, index) => (
        <div 
          key={index}
          className="absolute text-2xl pointer-events-none animate-pulse"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}rem`,
            opacity: item.opacity,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        >
          {item.emoji}
        </div>
      ))}
      
      {/* 컨텐츠 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
        <div className={`${iconContainerSize} bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 rounded-full flex items-center justify-center animate-pulse mb-4`}>
          <Zap size={iconSize} className="text-white" />
        </div>
        
        <h2 className={`${compact ? 'text-lg' : 'text-xl md:text-2xl'} font-bold text-gray-800 dark:text-white mb-2 text-center`}>
          {loadingText}{dots}
        </h2>
        
        <div className="w-full max-w-md bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-3">
          <div 
            className="bg-yellow-500 dark:bg-yellow-400 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        
        {/* 컴팩트 모드에서는 팁 표시하지 않음 */}
        {!compact && (
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 max-w-md">
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
              <span className="font-bold text-yellow-500 dark:text-yellow-400">요리 팁:</span> {loadingTips[randomTipIndex]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

RecipeLoadingUI.propTypes = {
  compact: PropTypes.bool
};

export default RecipeLoadingUI;