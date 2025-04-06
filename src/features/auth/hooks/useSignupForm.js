// src/features/auth/hooks/useSignupForm.js
import { useState, useCallback } from 'react';
import { 
  validateEmail, 
  validatePassword, 
  validatePhone, 
  validateName 
} from '../utils/validations';
import { INITIAL_FORM_DATA, INITIAL_ERRORS } from '../constants/formOptions';

/**
 * 회원가입 폼 상태와 로직을 관리하는 커스텀 훅
 * @param {Function} onSubmit - 폼 제출 핸들러
 * @returns {Object} 폼 상태와 핸들러
 */
export function useSignupForm(onSubmit) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'bg-gray-200'
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // 단일 필드 유효성 검사
  const validateField = useCallback((name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value) {
          newErrors.email = '이메일을 입력해주세요';
        } else if (!validateEmail(value)) {
          newErrors.email = '유효한 이메일 주소를 입력해주세요';
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'password':
        // 비밀번호 검증 및 강도 측정
        const result = validatePassword(value);
        setPasswordStrength(result);
        
        if (!value) {
          newErrors.password = '비밀번호를 입력해주세요';
        } else if (value.length < 8) {
          newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다';
        } else if (!result.isValid) {
          newErrors.password = '비밀번호가 너무 약합니다';
        } else {
          delete newErrors.password;
        }
        
        // 비밀번호 확인 필드도 재검증
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
        } else if (formData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
        
      case 'name':
        if (!value) {
          newErrors.name = '이름을 입력해주세요';
        } else if (!validateName(value)) {
          newErrors.name = '이름은 최소 2자 이상이어야 합니다';
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'phoneNumber':
        if (!value) {
          newErrors.phoneNumber = '전화번호를 입력해주세요';
        } else if (!validatePhone(value)) {
          newErrors.phoneNumber = '올바른 전화번호 형식이 아닙니다 (010-0000-0000)';
        } else {
          delete newErrors.phoneNumber;
        }
        break;
        
      case 'agreeTerms':
        if (!value) {
          newErrors.agreeTerms = '이용약관에 동의해주세요';
        } else {
          delete newErrors.agreeTerms;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [errors, formData.confirmPassword, formData.password]);
  
  // 전체 폼 유효성 검사
  const validateForm = useCallback(() => {
    // 모든 필수 필드 검증
    validateField('email', formData.email);
    validateField('password', formData.password);
    validateField('confirmPassword', formData.confirmPassword);
    validateField('name', formData.name);
    validateField('phoneNumber', formData.phoneNumber);
    validateField('agreeTerms', formData.agreeTerms);
    
    // 모든 에러 확인
    return Object.keys(errors).length === 0;
  }, [errors, formData, validateField]);
  
  // 입력값 변경 핸들러
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // 실시간 필드 검증
    validateField(name, newValue);
  }, [validateField]);
  
  // 입력값 직접 설정 핸들러 (커스텀 입력용)
  const handleValueChange = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    validateField(name, value);
  }, [validateField]);
  
  // 폼 제출 핸들러
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    // 폼 전체 유효성 검사
    if (validateForm()) {
      // 제출할 데이터 정리
      const submitData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        preferences: {
          spicyLevel: formData.spicyLevel,
          cookingTime: parseInt(formData.cookingTime, 10),
          vegetarian: formData.vegetarian
        }
      };
      
      onSubmit(submitData);
    }
  }, [formData, onSubmit, validateForm]);
  
  // 비밀번호 표시 토글
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);
  
  return {
    formData,
    errors,
    passwordStrength,
    showPassword,
    handleChange,
    handleValueChange,
    handleSubmit,
    togglePasswordVisibility,
    validateField,
    validateForm
  };
}

export default useSignupForm;