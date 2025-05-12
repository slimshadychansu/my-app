// src/features/chat/hooks/useVoiceWithChat.js
import { useCallback } from 'react';
import { useVoiceRecognition } from '../../../../hooks/useVoiceRecognition';

export function useVoiceWithChat(handleSubmit, setInput) {
  // 음성 인식 결과 처리 콜백
  const handleVoiceResult = useCallback((transcript, isFinal) => {
    setInput(transcript);
    if (isFinal) {
      handleSubmit(null, transcript);
    }
  }, [setInput, handleSubmit]);
  
  // 음성 인식 훅 사용
  const voiceControls = useVoiceRecognition(handleVoiceResult);
  
  return voiceControls;
}