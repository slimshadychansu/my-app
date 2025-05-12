// src/hooks/useVoiceRecognition.js
import { useState, useEffect, useCallback, useRef } from 'react';

export function useVoiceRecognition(onResultCallback) {
  // useState 훅을 조건부가 아닌 항상 호출되도록 수정
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  // 참조 객체로 콜백 저장
  const callbackRef = useRef(onResultCallback);
  
  // 콜백 업데이트 - 의존성 배열에 onResultCallback 추가
  useEffect(() => {
    callbackRef.current = onResultCallback;
  }, [onResultCallback]);
  
  // 의존성 배열 제거하여 항상 동일한 함수 참조 반환
  const handleResult = useCallback((transcript, isFinal) => {
    if (callbackRef.current) {
      callbackRef.current(transcript, isFinal);
    }
  }, []);
  
  // 컴포넌트 마운트 시 1번만 실행되도록 수정
  useEffect(() => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'ko-KR';
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          handleResult(transcript, false);
          
          if (event.results[0].isFinal) {
            setTimeout(() => {
              setIsListening(false);
              handleResult(transcript, true);
            }, 500);
          }
        };
        
        recognition.onerror = (event) => {
          console.error('음성 인식 오류:', event.error);
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        setSpeechRecognition(recognition);
        setSpeechSupported(true);
      } else {
        setSpeechSupported(false);
      }
    } catch (error) {
      console.error('음성 인식 초기화 실패:', error);
      setSpeechSupported(false);
    }

    return () => {
      // 정리 함수는 비워두기
    };
  }, []); // 의존성 배열 비우기
  
  const startListening = useCallback(() => {
    if (speechRecognition && !isListening) {
      try {
        speechRecognition.start();
        setIsListening(true);
        return true;
      } catch (error) {
        console.error('음성 인식 시작 실패:', error);
        return false;
      }
    }
    return false;
  }, [speechRecognition, isListening]);
  
  const stopListening = useCallback(() => {
    if (isListening && speechRecognition) {
      try {
        speechRecognition.stop();
        setIsListening(false);
        return true;
      } catch (error) {
        console.error('음성 인식 중지 실패:', error);
        return false;
      }
    }
    return false;
  }, [speechRecognition, isListening]);
  
  const toggleListening = useCallback(() => {
    if (isListening) {
      return stopListening();
    } else {
      return startListening();
    }
  }, [isListening, startListening, stopListening]);
  
  return { 
    isListening, 
    speechSupported, 
    startListening, 
    stopListening, 
    toggleListening 
  };
}

export default useVoiceRecognition;