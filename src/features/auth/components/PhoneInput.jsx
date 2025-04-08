// src/features/auth/components/PhoneInput.jsx
import React from 'react';
import PropTypes from 'prop-types';

function PhoneInput({ value, onChange, label, required = false, error = null }) {
  // 전화번호 형식화 함수 (010-0000-0000)
  const formatPhoneNumber = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    
    // 길이에 따라 형식 적용
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // 입력 처리 함수
  const handleChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none dark:bg-gray-700 dark:text-white ${
          error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 dark:border-gray-600'
        }`}
        placeholder="010-0000-0000"
        maxLength={13} // 하이픈 포함 최대 길이
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

PhoneInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string
};

export default PhoneInput;