// src/hooks/useRecipeTimer.js
import { useState, useRef, useEffect, useCallback } from 'react';

export function useRecipeTimer(initialTime = 0) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const timerRef = useRef(null);
  
  // 오디오 오류 해결: 기본적으로 오디오 비활성화하고 예외 처리
  const audioRef = useRef(null);
  
  // 컴포넌트 마운트 시 오디오 초기화 (오류 방지)
  useEffect(() => {
    try {
      // 오디오 초기화 코드 수정
      audioRef.current = new Audio();
      // 경로 수정 - 실제 프로젝트 구조에 맞게 경로 수정 필요
      audioRef.current.src = '/sounds/timer-end.mp3';
      audioRef.current.preload = 'auto';
      // 오디오 로드 테스트
      audioRef.current.load();
    } catch (error) {
      console.warn('오디오 초기화 실패:', error);
      // 오디오 없이도 작동하도록 설정
      audioRef.current = null;
    }
  }, []);

  // 타이머 시작
  const startTimer = useCallback((seconds) => {
    // 명시적인 시간 설정
    const timerSeconds = seconds || timeLeft;
    if (timerSeconds <= 0) return;
    
    console.log('타이머 시작:', timerSeconds);
    setTimeLeft(timerSeconds);
    setIsRunning(true);
  }, [timeLeft]);

  // 타이머 중지
  const pauseTimer = useCallback(() => {
    console.log('타이머 중지');
    setIsRunning(false);
  }, []);

  // 타이머 토글
  const toggleTimer = useCallback(() => {
    // 이미 실행 중이면 중지
    if (isRunning) {
      console.log('타이머 중지');
      setIsRunning(false);
      return;
    }
    
    // 실행 중이 아니면 시작
    if (timeLeft > 0) {
      console.log('타이머 시작 (토글):', timeLeft);
      setIsRunning(true);
    } else {
      console.log('타이머 시간이 0이어서 시작할 수 없음');
    }
  }, [isRunning, timeLeft]);

  // 타이머 초기화
  const resetTimer = useCallback((newTime) => {
    console.log('타이머 초기화:', newTime);
    
    // 이미 실행 중이면 초기화하지 않음
    if (isRunning) {
      console.log('타이머가 실행 중이어서 초기화하지 않습니다.');
      return;
    }
    
    // 기존 타이머가 있으면 제거
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setTimeLeft(newTime);
    setShowNotification(false);
  }, [isRunning]);

  // 시간 포맷팅 (00:00 형식)
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // 진행률 계산 (0-100%)
  const calculateProgress = useCallback((current, total) => {
    if (total <= 0) return 0;
    return 100 - (current / total) * 100;
  }, []);

  // 타이머 실행 로직 - setInterval 사용
  useEffect(() => {
    // 기존 타이머 정리
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // 타이머가 실행 중이고, 남은 시간이 있는 경우에만 인터벌 설정
    if (isRunning && timeLeft > 0) {
      // console.log('타이머 카운트다운 시작:', timeLeft);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            // 타이머 종료 처리
            clearInterval(timerRef.current);
            timerRef.current = null;
            setIsRunning(false);
            setShowNotification(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    // 컴포넌트 정리(cleanup) 함수
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, timeLeft, setShowNotification]);

  return {
    timeLeft,
    isRunning,
    showNotification,
    setShowNotification,
    startTimer,
    pauseTimer,
    toggleTimer,
    resetTimer,
    formatTime,
    calculateProgress,
    audioRef
  };
}

export default useRecipeTimer;