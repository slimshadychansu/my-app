// src/hooks/useRecipeTimer.js
import { useState, useEffect, useRef } from 'react';

export function useRecipeTimer() {
  const [timer, setTimer] = useState(null); // null, 'running', 'paused', 'finished'
  const [timeLeft, setTimeLeft] = useState(0);
  const [showTimerNotification, setShowTimerNotification] = useState(false);
  const audioRef = useRef(null);
  
  // 타이머 시작 함수
  const startTimer = (duration) => {
    if (duration > 0) {
      setTimeLeft(duration);
      setTimer('running');
      return true;
    }
    return false;
  };

  // 타이머 일시정지/재개 토글
  const toggleTimer = () => {
    setTimer(prev => prev === 'running' ? 'paused' : 'running');
  };

  // 타이머 리셋
  const resetTimer = (duration = 0) => {
    setTimer(null);
    setTimeLeft(duration);
    setShowTimerNotification(false);
  };
  
  // 타이머 효과
  useEffect(() => {
    let interval;
    if (timer === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && timer === 'running') {
      setTimer('finished');
      setShowTimerNotification(true);
      // Play sound
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    }
    return () => clearInterval(interval);
  }, [timer, timeLeft]);
  
  // 시간 포맷 함수
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 타이머 진행률 계산
  const calculateProgress = () => {
    if (timeLeft <= 0) return 0;
    const total = timeLeft; // 원래는 total 값을 따로 관리해야 하지만, 여기서는 간단히 처리
    const progress = (total - timeLeft) / total * 100;
    return progress;
  };
  
  return { 
    timer, 
    timeLeft, 
    showTimerNotification, 
    setShowTimerNotification, 
    startTimer, 
    toggleTimer, 
    resetTimer, 
    formatTime, 
    calculateProgress,
    audioRef
  };
}