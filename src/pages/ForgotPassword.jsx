// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/animation/PageTransition';
import { FadeIn } from '../components/animation/FadeIn';
import Button from '../components/common/Button';
import ErrorAlert from '../components/common/ErrorAlert';
import { useAuth } from '../features/auth/hooks/useAuth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { requestPasswordReset, loading } = useAuth();

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
    
    // 에러 초기화
    setError('');
    
    try {
      // 비밀번호 재설정 요청
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || '비밀번호 재설정 요청에 실패했습니다.');
    }
  };

  return (
    <PageTransition>
      <div className="max-w-md mx-auto mt-16 p-6">
        <FadeIn>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            {submitted ? (
              // 요청 완료 후 화면
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">이메일 발송 완료</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {email}로 비밀번호 재설정 지침을 보냈습니다. 이메일을 확인해주세요.
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  이메일이 도착하지 않았다면 스팸 폴더를 확인하거나 다시 시도해주세요.
                </p>
                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={() => {
                      setSubmitted(false);
                      setEmail('');
                    }}
                  >
                    다시 시도
                  </Button>
                  <Link 
                    to="/login" 
                    className="mt-2 px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    로그인 페이지로 돌아가기
                  </Link>
                </div>
              </div>
            ) : (
              // 이메일 입력 폼
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">비밀번호 재설정</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    계정에 등록된 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <ErrorAlert message={error} />
                  
                  <div>
                    <label htmlFor="email" className="block mb-1 font-medium text-gray-700 dark:text-white">
                      이메일
                    </label>
                    <input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="가입 시 사용한 이메일을 입력하세요"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    isLoading={loading}
                    fullWidth={true}
                  >
                    비밀번호 재설정 링크 받기
                  </Button>
                  
                  <div className="mt-4 text-center">
                    <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                      로그인 페이지로 돌아가기
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}

export default ForgotPassword;