import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userState } from '../store/atoms';

function SignUp() {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    spicyLevel: '보통',
    cookingTime: 30,
    vegetarian: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 실시간 오류 체크
    if (name === 'confirmPassword' && formData.password !== value) {
      setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }));
    } else if (name === 'confirmPassword' && formData.password === value) {
      setErrors(prev => {
        const { confirmPassword, ...rest } = prev;
        return rest;
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }
    
    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다';
    }
    
    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    
    // 이름 검증
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      // 회원가입 로직 (API 연동 대신 임시 처리)
      setTimeout(() => {
        // 가상의 사용자 ID 생성
        const userId = `user_${Date.now()}`;
        
        // 사용자 정보 설정 (기존 상태 구조 유지)
        const userData = {
          isLoggedIn: true,
          id: userId,
          name: formData.name,
          email: formData.email,
          preferences: {
            spicyLevel: formData.spicyLevel,
            cookingTime: parseInt(formData.cookingTime),
            vegetarian: formData.vegetarian
          }
        };
        
        // Recoil 상태 업데이트
        setUser(userData);
        
        // 회원가입 성공 후 홈 페이지로 이동
        alert('회원가입이 완료되었습니다!');
        navigate('/');
        
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">회원가입</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          {/* 이메일 입력 */}
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          {/* 비밀번호 입력 */}
          <div className="mb-4">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="6자 이상 입력해주세요"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          {/* 비밀번호 확인 */}
          <div className="mb-4">
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="비밀번호를 다시 입력해주세요"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          
          {/* 이름 입력 */}
          <div className="mb-4">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              이름 (닉네임)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="요리 활동에 사용할 이름을 입력해주세요"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          {/* 요리 환경설정 */}
          <div className="mt-6 mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">요리 환경설정</h3>
            
            {/* 매운맛 선호도 */}
            <div className="mb-3">
              <label 
                htmlFor="spicyLevel" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                매운맛 선호도
              </label>
              <select
                id="spicyLevel"
                name="spicyLevel"
                value={formData.spicyLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="안매움">안매움</option>
                <option value="약간">약간</option>
                <option value="보통">보통</option>
                <option value="매움">매움</option>
                <option value="아주매움">아주매움</option>
              </select>
            </div>
            
            {/* 요리 시간 */}
            <div className="mb-3">
              <label 
                htmlFor="cookingTime" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                선호하는 요리 시간 (분)
              </label>
              <input
                type="number"
                id="cookingTime"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
                min="5"
                max="180"
                step="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* 채식 여부 */}
            <div className="mb-3">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  name="vegetarian"
                  checked={formData.vegetarian}
                  onChange={handleChange}
                  className="mr-2"
                />
                채식주의자
              </label>
            </div>
          </div>
          
          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? '처리 중...' : '회원가입'}
          </button>
        </form>
        
        {/* 로그인 링크 */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-500 hover:underline focus:outline-none"
            >
              로그인하기
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;