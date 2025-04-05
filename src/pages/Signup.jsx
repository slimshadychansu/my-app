// src/pages/Signup.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageTransition } from '../components/animation/PageTransition';
import { FadeIn } from '../components/animation/FadeIn';
import SignupForm from '../features/auth/components/SignupForm';
import { useAuth } from '../features/auth/hooks/useAuth';

function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loading, error, user, authChecked } = useAuth();
  
  // 쿼리 파라미터에서 리디렉션 정보 추출
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('from') || location.state?.from?.pathname || '/';
  
  // 이미 로그인한 경우 리디렉션
  useEffect(() => {
    if (authChecked && user.isLoggedIn) {
      navigate(from);
    }
  }, [user.isLoggedIn, authChecked, navigate, from]);
  
  // 회원가입 처리 함수
  const handleRegister = async (userData) => {
    try {
      await register(userData);
      
      // 회원가입 성공 시 홈페이지로 이동
      navigate('/', { 
        state: { 
          message: '회원가입이 완료되었습니다! 환영합니다!' 
        } 
      });
    } catch (err) {
      // 에러는 useAuth 내에서 처리됨
      console.error('회원가입 처리 중 오류:', err);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto p-4 my-8">
        <FadeIn>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">회원가입</h1>
              <p className="text-gray-600 dark:text-gray-400">
                달그락 회원이 되어 다양한 레시피와 요리 팁을 만나보세요!
              </p>
            </div>
            
            <SignupForm 
              onRegister={handleRegister}
              isLoading={loading}
              initialError={error}
            />
            
            {/* 앱 소개 (선택 사항) */}
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-center text-gray-800 dark:text-white">
                달그락에서 누릴 수 있는 혜택
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">AI 요리 어시스턴트</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      언제 어디서나 요리 가이드를 받을 수 있어요
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">맞춤형 레시피 추천</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      취향에 맞는 레시피를 추천받을 수 있어요
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">요리 타이머 기능</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      요리 시간을 효율적으로 관리할 수 있어요
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">커뮤니티 활동</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      다른 요리 애호가들과 소통할 수 있어요
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}

export default Signup;