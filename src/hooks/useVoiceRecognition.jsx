// src/hooks/useVoiceRecognition.js
import { useState, useEffect, useCallback, useRef } from 'react';

export function useVoiceRecognition(onResultCallback) {
 const [isListening, setIsListening] = useState(false);
 const [speechRecognition, setSpeechRecognition] = useState(null);
 const [speechSupported, setSpeechSupported] = useState(false);
 
 // ref로 콜백 저장
 const callbackRef = useRef(onResultCallback);
 
 // 콜백 업데이트
 useEffect(() => {
   callbackRef.current = onResultCallback;
 }, [onResultCallback]);
 
 // 결과 처리 함수
 const handleResult = useCallback((transcript, isFinal) => {
   if (callbackRef.current) {
     callbackRef.current(transcript, isFinal);
   }
 }, []); // 의존성 없음
 
 // Web Speech API 지원 확인 및 초기화
 useEffect(() => {
   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
   
   if (SpeechRecognition) {
     const recognition = new SpeechRecognition();
     recognition.continuous = false;
     recognition.interimResults = true;
     recognition.lang = 'ko-KR'; // 한국어 설정
     
     // 음성 인식 결과 처리
     recognition.onresult = (event) => {
       const transcript = Array.from(event.results)
         .map(result => result[0])
         .map(result => result.transcript)
         .join('');
       
       // 중간 결과를 콜백으로 전달
       handleResult(transcript, false);
       
       // 음성 인식이 끝나면 자동 제출
       if (event.results[0].isFinal) {
         setTimeout(() => {
           setIsListening(false);
           handleResult(transcript, true);
         }, 500);
       }
     };
     
     // 오류 처리
     recognition.onerror = (event) => {
       console.error('Speech recognition error', event.error);
       setIsListening(false);
     };
     
     // 음성 인식 종료 처리
     recognition.onend = () => {
       setIsListening(false);
     };
     
     setSpeechRecognition(recognition);
     setSpeechSupported(true);
   } else {
     setSpeechSupported(false);
   }

   // 컴포넌트 언마운트 시 정리
   return () => {
     if (speechRecognition) {
       speechRecognition.stop();
     }
   };
 }, []); // 의존성 제거
 
 // 음성 인식 시작
 const startListening = useCallback(() => {
   if (speechRecognition && !isListening) {
     speechRecognition.start();
     setIsListening(true);
   }
 }, [speechRecognition, isListening]);
 
 // 음성 인식 종료
 const stopListening = useCallback(() => {
   if (speechRecognition && isListening) {
     speechRecognition.stop();
     setIsListening(false);
   }
 }, [speechRecognition, isListening]);
 
 // 음성 인식 토글
 const toggleListening = useCallback(() => {
   if (isListening) {
     stopListening();
   } else {
     startListening();
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