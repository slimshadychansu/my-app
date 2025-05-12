// src/features/auth/components/SignupForm.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ErrorAlert from './ErrorAlert';
import Button from './Button';
import AccountInfoSection from './AccountInfosection';
import PersonalInfoSection from './PersonalInfoSection';
import PreferencesSection from './PreferencesSection';
import { useSignupForm } from '../hooks/useSignupForm';

/**
 * 회원가입 폼 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {Function} props.onRegister - 회원가입 처리 함수
 * @param {Boolean} props.isLoading - 로딩 상태
 * @param {String} props.initialError - 초기 에러 메시지
 */
function SignupForm({ 
  onRegister, 
  isLoading = false, 
  initialError = '' 
}) {
  const { 
    formData,
    errors,
    passwordStrength,
    showPassword,
    handleChange,
    handleValueChange,
    handleSubmit,
    togglePasswordVisibility
  } = useSignupForm(onRegister);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 일반 에러 메시지 */}
      <ErrorAlert message={initialError} />
      
      {/* 계정 정보 섹션 */}
      <AccountInfoSection 
        formData={formData}
        errors={errors}
        passwordStrength={passwordStrength}
        showPassword={showPassword}
        onTogglePasswordVisibility={togglePasswordVisibility}
        onChange={handleChange}
      />
      
      {/* 개인 정보 섹션 */}
      <PersonalInfoSection 
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onPhoneChange={handleValueChange}
      />
      
      {/* 환경설정 섹션 */}
      <PreferencesSection 
        formData={formData}
        onChange={handleChange}
      />
      
      {/* 이용약관 동의 */}
      <div className="pt-2">
        <label className="flex items-center text-gray-700 dark:text-white cursor-pointer">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 ${
              errors.agreeTerms ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            required
          />
          <span className="ml-2">
            <span className="text-gray-700 dark:text-gray-300">이용약관 및 </span>
            <Link to="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400">개인정보 처리방침</Link>
            <span className="text-gray-700 dark:text-gray-300">에 동의합니다</span>
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="mt-1 text-sm text-red-500">{errors.agreeTerms}</p>
        )}
      </div>
      
      {/* 회원가입 버튼 */}
      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth={true}
      >
        회원가입
      </Button>
      
      {/* 로그인 링크 */}
      <p className="text-center text-gray-600 dark:text-gray-400">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">
          로그인하기
        </Link>
      </p>
    </form>
  );
}

SignupForm.propTypes = {
  onRegister: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  initialError: PropTypes.string
};

export default SignupForm;