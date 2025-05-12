// src/utils/chromeSpeechUtils.js

/**
 * Chrome 브라우저를 위한 Web Speech API 유틸리티
 * 음성 인식(STT)과 텍스트 음성 변환(TTS) 기능을 제공합니다.
 */
class ChromeSpeechUtils {
    constructor() {
      // TTS 관련 속성
      this.synth = window.speechSynthesis;
      this.voices = [];
      this.selectedVoice = null;
      
      // STT 관련 속성
      this.recognition = null;
      this.isListening = false;
      this.transcript = '';
      this.confidence = 0;
      
      // 브라우저 지원 여부 확인
      this.isTTSSupported = typeof this.synth !== 'undefined';
      this.isSTTSupported = typeof window.webkitSpeechRecognition !== 'undefined';
      
      // TTS 음성 목록 로드
      if (this.isTTSSupported) {
        // Chrome에서는 음성 목록이 비동기적으로 로드되므로 이벤트 리스너 추가
        this.synth.onvoiceschanged = this.loadVoices.bind(this);
        this.loadVoices();
      }
      
      // STT 초기화
      if (this.isSTTSupported) {
        this.initSpeechRecognition();
      }
    }
    
    /**
     * 사용 가능한 음성 목록을 로드합니다.
     */
    loadVoices() {
      this.voices = this.synth.getVoices();
      
      // 한국어 음성이 있으면 기본 선택
      const koreanVoice = this.voices.find(voice => voice.lang.includes('ko'));
      if (koreanVoice) {
        this.selectedVoice = koreanVoice;
      } else if (this.voices.length > 0) {
        this.selectedVoice = this.voices[0];
      }
      
      return this.voices;
    }
    
    /**
     * 음성 인식 기능을 초기화합니다.
     */
    initSpeechRecognition() {
      try {
        // Chrome의 SpeechRecognition 객체 생성
        this.recognition = new window.webkitSpeechRecognition();
        
        // 설정
        this.recognition.continuous = false; // 연속 인식 모드 비활성화
        this.recognition.interimResults = true; // 중간 결과 활성화
        this.recognition.lang = 'ko-KR'; // 기본 언어 설정 (한국어)
        
        // 이벤트 핸들러 설정
        this.recognition.onstart = () => {
          this.isListening = true;
          console.log('음성 인식이 시작되었습니다.');
        };
        
        this.recognition.onend = () => {
          this.isListening = false;
          console.log('음성 인식이 종료되었습니다.');
        };
        
        this.recognition.onresult = (event) => {
          // 가장 최근 인식 결과 가져오기
          const result = event.results[event.results.length - 1];
          this.transcript = result[0].transcript;
          this.confidence = result[0].confidence;
          
          console.log(`인식된 텍스트: ${this.transcript} (정확도: ${this.confidence})`);
          
          // 결과 이벤트 발생
          if (this.onResult) {
            this.onResult({
              transcript: this.transcript,
              confidence: this.confidence,
              isFinal: result.isFinal
            });
          }
        };
        
        this.recognition.onerror = (event) => {
          console.error('음성 인식 오류:', event.error);
          this.isListening = false;
          
          if (this.onError) {
            this.onError(event.error);
          }
        };
        
      } catch (error) {
        console.error('음성 인식 초기화 실패:', error);
        this.isSTTSupported = false;
      }
    }
    
    /**
     * 음성 인식을 시작합니다.
     * @param {Object} options - 음성 인식 옵션
     * @param {string} options.lang - 인식할 언어 (예: 'ko-KR', 'en-US')
     * @param {Function} options.onResult - 인식 결과 콜백 함수
     * @param {Function} options.onError - 오류 발생 시 콜백 함수
     */
    startListening(options = {}) {
      if (!this.isSTTSupported || !this.recognition) {
        console.error('이 브라우저는 음성 인식을 지원하지 않습니다.');
        return false;
      }
      
      if (this.isListening) {
        this.stopListening();
      }
      
      // 옵션 설정
      if (options.lang) {
        this.recognition.lang = options.lang;
      }
      
      if (options.onResult) {
        this.onResult = options.onResult;
      }
      
      if (options.onError) {
        this.onError = options.onError;
      }
      
      // 인식 시작
      try {
        this.recognition.start();
        return true;
      } catch (error) {
        console.error('음성 인식 시작 실패:', error);
        return false;
      }
    }
    
    /**
     * 음성 인식을 중지합니다.
     */
    stopListening() {
      if (this.isListening && this.recognition) {
        try {
          this.recognition.stop();
          return true;
        } catch (error) {
          console.error('음성 인식 중지 실패:', error);
          return false;
        }
      }
      return false;
    }
    
    /**
     * 텍스트를 음성으로 변환합니다.
     * @param {string} text - 음성으로 변환할 텍스트
     * @param {Object} options - TTS 옵션
     * @param {SpeechSynthesisVoice} options.voice - 사용할 음성
     * @param {number} options.rate - 말하기 속도 (0.1-10)
     * @param {number} options.pitch - 음높이 (0-2)
     * @param {number} options.volume - 볼륨 (0-1)
     * @returns {boolean} - 성공 여부
     */
    speak(text, options = {}) {
      if (!this.isTTSSupported) {
        console.error('이 브라우저는 텍스트 음성 변환을 지원하지 않습니다.');
        return false;
      }
      
      // 진행 중인 음성 출력이 있으면 중지
      this.stop();
      
      // 음성 합성 객체 생성
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 옵션 설정
      utterance.voice = options.voice || this.selectedVoice;
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      
      // 이벤트 핸들러
      if (options.onStart) {
        utterance.onstart = options.onStart;
      }
      
      if (options.onEnd) {
        utterance.onend = options.onEnd;
      }
      
      if (options.onError) {
        utterance.onerror = options.onError;
      }
      
      // 음성 합성 시작
      this.synth.speak(utterance);
      return true;
    }
    
    /**
     * 현재 재생 중인 음성을 중지합니다.
     */
    stop() {
      if (this.isTTSSupported) {
        this.synth.cancel();
        return true;
      }
      return false;
    }
    
    /**
     * 현재 재생 중인 음성을 일시 중지합니다.
     */
    pause() {
      if (this.isTTSSupported) {
        this.synth.pause();
        return true;
      }
      return false;
    }
    
    /**
     * 일시 중지된 음성을 다시 재생합니다.
     */
    resume() {
      if (this.isTTSSupported) {
        this.synth.resume();
        return true;
      }
      return false;
    }
    
    /**
     * 특정 언어의 음성 목록을 반환합니다.
     * @param {string} langCode - 언어 코드 (예: 'ko-KR', 'en-US')
     * @returns {Array} - 해당 언어의 음성 목록
     */
    getVoicesByLang(langCode) {
      if (!this.isTTSSupported) return [];
      return this.voices.filter(voice => voice.lang.includes(langCode));
    }
    
    /**
     * 음성을 선택합니다.
     * @param {SpeechSynthesisVoice} voice - 선택할 음성
     */
    setVoice(voice) {
      this.selectedVoice = voice;
    }
    
    /**
     * 지원 여부를 확인합니다.
     * @returns {Object} - TTS와 STT 지원 여부
     */
    checkSupport() {
      return {
        tts: this.isTTSSupported,
        stt: this.isSTTSupported
      };
    }
  }
  
  // 싱글톤 인스턴스 생성 및 내보내기
  const speechUtils = new ChromeSpeechUtils();
  export default speechUtils;