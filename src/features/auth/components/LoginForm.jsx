// src/features/auth/components/LoginForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import ErrorAlert from '../../../components/common/ErrorAlert';

/**
 * 로그인 폼 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {Function} props.onLogin - 로그인 처리 함수
 * @param {Boolean} props.isLoading - 로딩 상태
 * @param {String} props.initialError - 초기 에러 메시지
 */
function LoginForm({ 
  onLogin, 
  isLoading = false, 
  initialError = '',
  redirectUrl = '/'
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // 이메일 유효성 검사
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 입력값 검증
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }
    
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }
    
    // 에러 초기화
    setError('');
    
    try {
      // 로그인 처리
      await onLogin({ email, password, rememberMe });
    } catch (err) {
      // 서버에서 반환된 오류 메시지 표시
      setError(err.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 에러 메시지 */}
      <ErrorAlert message={error} />
      
      {/* 이메일 입력 */}
      <div>
        <label htmlFor="email" className="block mb-1 font-medium text-gray-700 dark:text-white">
          이메일
        </label>
        <input 
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          required
          autoComplete="email"
          aria-describedby="email-error"
        />
      </div>

      {/* 비밀번호 입력 */}
      <div>
        <label htmlFor="password" className="block mb-1 font-medium text-gray-700 dark:text-white">
          비밀번호
        </label>
        <div className="relative">
          <input 
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            required
            autoComplete="current-password"
            aria-describedby="password-error"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 추가 옵션 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            로그인 상태 유지
          </label>
        </div>
        <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          비밀번호 찾기
        </Link>
      </div>

      {/* 로그인 버튼 */}
      <Button 
        type="submit"
        isLoading={isLoading}
        fullWidth={true}
      >
        로그인
      </Button>
      
      {/* 회원가입 링크 */}
      <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">
          회원가입
        </Link>
      </p>
    </form>
  );
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  initialError: PropTypes.string,
  redirectUrl: PropTypes.string
};

export default LoginForm;