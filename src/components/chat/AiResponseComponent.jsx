// src/components/chat/AiResponseComponent.jsx
import React, { useEffect, useState } from 'react';
import speechUtils from '../../utils/chromeSpeechUtils';

function AiResponseComponent({ response, hasRecipe = true, onStartRecipe = () => {}, isCookingMode = false }) {
  // response가 null이나 undefined인 경우 처리
  if (!response) {
    return <div className="ai-response">응답 데이터가 없습니다.</div>;
  }
  
  // 오류 메시지 처리
  if (response.isError) {
    return (
      <div className="ai-response text-red-500">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>오류 발생</span>
        </div>
        <div>{response.content}</div>
      </div>
    );
  }
  
  // 요리 가이드 모드에서는 간결한 텍스트만 사용
  const displayText = response.content || '';
  
  // 요리 가이드 모드가 아닐 때만 문장 단위 줄바꿈 적용
  const formattedText = isCookingMode ? displayText : displayText.replace(/\. /g, '.\n');
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [supportInfo, setSupportInfo] = useState({ tts: false });
  
  // 레시피 데이터 확인 (요리 가이드 모드에서는 레시피 버튼 표시 안함)
  const hasRecipeData = !isCookingMode && (response.recipe || (response.title && response.steps));
  
  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    // 저장된 설정 불러오기
    const savedAutoSpeak = localStorage.getItem('tts-autoplay');
    if (savedAutoSpeak) {
      setAutoSpeak(savedAutoSpeak === 'true');
    }
    
    // TTS 지원 여부 확인
    const support = speechUtils.checkSupport();
    setSupportInfo(support);
    
    // 컴포넌트 언마운트 시 음성 중지
    return () => {
      if (support.tts) {
        speechUtils.stop();
      }
    };
  }, []);
  
  // 응답이 변경될 때 자동 음성 재생
  useEffect(() => {
    if (autoSpeak && supportInfo.tts && formattedText) {
      speakText();
    }
  }, [formattedText, autoSpeak, supportInfo.tts]);
  
  // 텍스트 음성 변환 실행
  const speakText = () => {
    if (!supportInfo.tts || !formattedText) return;
    
    // 이미 말하고 있으면 중지
    if (isSpeaking) {
      speechUtils.stop();
      setIsSpeaking(false);
      return;
    }
    
    // TTS에 전달할 텍스트 정제 (줄바꿈 제거)
    const cleanText = formattedText
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // 텍스트가 비어있는 경우 처리
    if (!cleanText) return;
    
    setIsSpeaking(true);
    
    speechUtils.speak(cleanText, {
      onStart: () => {
        setIsSpeaking(true);
      },
      onEnd: () => {
        setIsSpeaking(false);
      },
      onError: (error) => {
        console.error('TTS 오류:', error);
        setIsSpeaking(false);
      }
    });
  };
  
  // 자동 재생 토글
  const toggleAutoSpeak = () => {
    const newValue = !autoSpeak;
    setAutoSpeak(newValue);
    localStorage.setItem('tts-autoplay', newValue.toString());
    
    // 자동 재생을 켰는데 현재 응답이 있으면 바로 재생
    if (newValue && formattedText && !isSpeaking) {
      speakText();
    }
  };
  
  // Chrome이 아니거나 TTS를 지원하지 않는 경우
  if (!supportInfo.tts) {
    return (
      <div className="ai-response" style={{ whiteSpace: 'pre-wrap' }}>
        {formattedText}
      </div>
    );
  }
  
  return (
    <div className="ai-response relative">
      {/* TTS 컨트롤 버튼 */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={speakText}
          className={`p-2 rounded-full transition-colors ${
            isSpeaking 
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
              : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
          }`}
          aria-label={isSpeaking ? '음성 중지' : '음성으로 듣기'}
          title={isSpeaking ? '음성 중지' : '음성으로 듣기'}
        >
          {isSpeaking ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
            </svg>
          )}
        </button>
        
        {/* 자동 읽기 토글 */}
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={autoSpeak} 
            onChange={toggleAutoSpeak}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-600 dark:text-gray-300">자동 읽기</span>
        </label>
      </div>
      
      {/* 응답 텍스트 표시 */}
      <div style={{ whiteSpace: 'pre-wrap' }} className={isSpeaking ? 'text-blue-600 dark:text-blue-400' : ''}>
        {formattedText}
      </div>
      
      {/* 레시피가 있을 때만 요리 가이드 버튼 표시 */}
      {hasRecipeData && (
        <div className="mt-4">
          <button 
            onClick={() => onStartRecipe(response.recipe || response)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            요리 가이드 시작
          </button>
        </div>
      )}
    </div>
  );
}

export default AiResponseComponent;