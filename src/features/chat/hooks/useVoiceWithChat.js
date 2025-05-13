// src/features/chat/hooks/useVoiceWithChat.js
import { useCallback, useState, useEffect } from 'react';
import { useVoiceRecognition } from '../../../hooks/useVoiceRecognition';
import speechUtils from '../../../utils/chromeSpeechUtils';

export function useVoiceWithChat(handleSubmit, setInput) {
  const [autoTTS, setAutoTTS] = useState(false);
  
  // 로컬 스토리지에서 자동 TTS 설정 불러오기
  useEffect(() => {
    const savedAutoTTS = localStorage.getItem('chat-auto-tts');
    if (savedAutoTTS) {
      setAutoTTS(savedAutoTTS === 'true');
    }
  }, []);
  
  // 자동 TTS 토글 함수
  const toggleAutoTTS = useCallback(() => {
    const newValue = !autoTTS;
    setAutoTTS(newValue);
    localStorage.setItem('chat-auto-tts', newValue.toString());
  }, [autoTTS]);
  
  // 텍스트 음성 변환 함수
  const speakText = useCallback((text) => {
    if (!text) return false;
    
    const support = speechUtils.checkSupport();
    if (!support.tts) return false;
    
    return speechUtils.speak(text, {
      rate: 0.9,
      volume: 1
    });
  }, []);
  
  // 음성 중지 함수
  const stopSpeaking = useCallback(() => {
    const support = speechUtils.checkSupport();
    if (!support.tts) return false;
    
    return speechUtils.stop();
  }, []);
  
  // 음성 인식 결과 처리 콜백
  const handleVoiceResult = useCallback((transcript, isFinal) => {
    setInput(transcript);
    if (isFinal) {
      handleSubmit(null, transcript);
    }
  }, [setInput, handleSubmit]);
  
  // 음성 인식 훅 사용
  const voiceControls = useVoiceRecognition(handleVoiceResult);
  
  return {
    ...voiceControls,
    autoTTS,
    toggleAutoTTS,
    speakText,
    stopSpeaking
  };
}

export default useVoiceWithChat;