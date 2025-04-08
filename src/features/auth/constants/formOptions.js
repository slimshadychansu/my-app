// src/features/auth/constants/formOptions.js
export const SPICY_LEVELS = [
    { value: '안매움', label: '안매움' },
    { value: '약간', label: '약간 매움' },
    { value: '보통', label: '보통' },
    { value: '매움', label: '매움' },
    { value: '아주매움', label: '아주 매움' }
  ];
  
  export const COOKING_TIME_RANGE = {
    min: 10,
    max: 120,
    step: 5,
    default: 30
  };
  
  export const INITIAL_FORM_DATA = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: '',
    spicyLevel: '보통',
    cookingTime: 30,
    vegetarian: false,
    agreeTerms: false
  };
  
  export const INITIAL_ERRORS = {};