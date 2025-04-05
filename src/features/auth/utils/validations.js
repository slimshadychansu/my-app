// src/features/auth/utils/validations.js
/**
 * 이메일 유효성 검사
 * @param {string} email - 이메일 주소
 * @returns {boolean} 유효성 여부
 */
export function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  /**
   * 비밀번호 유효성 검사
   * @param {string} password - 비밀번호
   * @returns {Object} 비밀번호 강도 정보 (점수, 메시지, 색상)
   */
  export function validatePassword(password) {
    if (!password) {
      return {
        isValid: false,
        score: 0,
        message: '',
        color: 'bg-gray-200'
      };
    }
    
    let score = 0;
    let isValid = false;
    
    // 길이 점수
    if (password.length >= 8) score++;
    if (password.length >= 10) score++;
    
    // 복잡성 점수
    if (/[A-Z]/.test(password)) score++; // 대문자
    if (/[a-z]/.test(password)) score++; // 소문자
    if (/[0-9]/.test(password)) score++; // 숫자
    if (/[^A-Za-z0-9]/.test(password)) score++; // 특수문자
    
    // 다양성 점수
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= 5) score++;
    if (uniqueChars >= 7) score++;
    
    // 최종 점수는 0-5 사이
    const finalScore = Math.min(5, Math.floor(score / 2));
    
    // 최소 안전 기준 (8자 이상, 점수 2 이상)
    isValid = password.length >= 8 && finalScore >= 2;
    
    const messages = [
      '',
      '매우 약함',
      '약함',
      '보통',
      '강함',
      '매우 강함'
    ];
    
    const colors = [
      'bg-gray-200',
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-green-600'
    ];
    
    return {
      isValid,
      score: finalScore,
      message: messages[finalScore],
      color: colors[finalScore]
    };
  }
  
  /**
   * 전화번호 유효성 검사
   * @param {string} phone - 전화번호
   * @returns {boolean} 유효성 여부
   */
  export function validatePhone(phone) {
    // 010-0000-0000 형식 검사
    return /^010-\d{4}-\d{4}$/.test(phone);
  }
  
  /**
   * 이름 유효성 검사
   * @param {string} name - 이름
   * @returns {boolean} 유효성 여부
   */
  export function validateName(name) {
    return name && name.trim().length >= 2;
  }