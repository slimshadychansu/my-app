// src/pages/Login.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageTransition } from '../components/animation/PageTransition';
import { FadeIn } from '../components/animation/FadeIn';
import LoginForm from '../features/auth/components/LoginForm';
import { useAuth } from '../features/auth/hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, user, authChecked } = useAuth();
  
  // 쿼리 파라미터에서 리디렉션 정보 추출
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('from') || location.state?.from?.pathname || '/';
  const expired = searchParams.get('expired') === 'true';
  const message = searchParams.get('message');
  
  // 이미 로그인한 경우 리디렉션
  useEffect(() => {
    if (authChecked && user.isLoggedIn) {
      navigate(from);
    }
  }, [user.isLoggedIn, authChecked, navigate, from]);
  
  // 로그인 처리 함수
  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      navigate(from);
    } catch (err) {
      // 에러는 useAuth 내에서 처리됨
      console.error('로그인 처리 중 오류:', err);
    }
  };
  
  // 초기 에러 메시지 설정
  const getInitialError = () => {
    if (expired) return '로그인 세션이 만료되었습니다. 다시 로그인해주세요.';
    if (message) return decodeURIComponent(message);
    if (error) return error;
    return '';
  };

  return (
    <PageTransition>
      <div className="max-w-md mx-auto mt-10 p-6">
        <FadeIn>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">로그인</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {from === '/' 
                  ? '달그락에 오신 것을 환영합니다' 
                  : '계속하려면 로그인해주세요'}
              </p>
            </div>
            
            <LoginForm 
              onLogin={handleLogin}
              isLoading={loading}
              initialError={getInitialError()}
              redirectUrl={from}
            />
            
            {/* 간편 로그인 (선택사항) */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                또는 다음으로 로그인
              </p>
              <div className="flex justify-center space-x-4">
                <button className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545 10.239v3.821h5.445c-0.643 2.783-3.006 4.196-5.445 4.196-3.332 0-6.033-2.701-6.033-6.033s2.701-6.033 6.033-6.033c1.475 0 2.813 0.538 3.855 1.425l2.942-2.942c-1.819-1.685-4.234-2.72-6.797-2.72-5.523 0-10 4.477-10 10s4.477 10 10 10c5.769 0 9.573-4.053 9.573-9.759 0-0.755-0.086-1.51-0.239-2.229h-9.333z" />
                  </svg>
                </button>
                <button className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </button>
                <button className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}

export default Login;