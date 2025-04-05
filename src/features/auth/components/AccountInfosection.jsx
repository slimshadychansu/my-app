// src/features/auth/components/AccountInfoSection.jsx
import React from 'react';
import PropTypes from 'prop-types';

function AccountInfoSection({ 
  formData, 
  errors, 
  passwordStrength,
  showPassword,
  onTogglePasswordVisibility, 
  onChange 
}) {
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
        계정 정보
      </h3>
      
      {/* 이메일 입력 */}
      <div>
        <label htmlFor="email" className="block mb-1 font-medium text-gray-700 dark:text-white">
          이메일 <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none dark:bg-gray-700 dark:text-white ${
            errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 dark:border-gray-600'
          }`}
          placeholder="example@email.com"
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      
      {/* 비밀번호 입력 */}
      <div>
        <label htmlFor="password" className="block mb-1 font-medium text-gray-700 dark:text-white">
          비밀번호 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none dark:bg-gray-700 dark:text-white ${
              errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 dark:border-gray-600'
            }`}
            placeholder="8자 이상 입력해주세요"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={onTogglePasswordVisibility}
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
        
        {/* 비밀번호 강도 표시 */}
        {formData.password && (
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
              <div 
                className={`h-full ${passwordStrength.color} transition-all duration-300`} 
                style={{ width: `${passwordStrength.score * 20}%` }}
              />
            </div>
            <p className={`text-xs mt-1 ${
              passwordStrength.score <= 1 ? 'text-red-500' : 
              passwordStrength.score <= 2 ? 'text-orange-500' : 
              passwordStrength.score <= 3 ? 'text-yellow-500' : 'text-green-500'
            }`}>
              {passwordStrength.message}
            </p>
            {passwordStrength.score <= 2 && (
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                안전한 비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.
              </p>
            )}
          </div>
        )}
        
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>
      
      {/* 비밀번호 확인 */}
      <div>
        <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700 dark:text-white">
          비밀번호 확인 <span className="text-red-500">*</span>
        </label>
        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none dark:bg-gray-700 dark:text-white ${
            errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 dark:border-gray-600'
          }`}
          placeholder="비밀번호를 다시 입력해주세요"
          required
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>
    </div>
  );
}

AccountInfoSection.propTypes = {
  formData: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  passwordStrength: PropTypes.object.isRequired,
  showPassword: PropTypes.bool.isRequired,
  onTogglePasswordVisibility: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default AccountInfoSection;