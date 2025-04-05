// src/features/auth/components/PersonalInfoSection.jsx
import React from 'react';
import PropTypes from 'prop-types';
import PhoneInput from './PhoneInput';

function PersonalInfoSection({ formData, errors, onChange, onPhoneChange }) {
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
        개인 정보
      </h3>
      
      {/* 이름 입력 */}
      <div>
        <label htmlFor="name" className="block mb-1 font-medium text-gray-700 dark:text-white">
          이름 (닉네임) <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none dark:bg-gray-700 dark:text-white ${
            errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 dark:border-gray-600'
          }`}
          placeholder="요리 활동에 사용할 이름을 입력해주세요"
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>
      
      {/* 전화번호 입력 */}
      <PhoneInput
        label="전화번호"
        value={formData.phoneNumber}
        onChange={(value) => onPhoneChange('phoneNumber', value)}
        required={true}
        error={errors.phoneNumber}
      />
    </div>
  );
}

PersonalInfoSection.propTypes = {
  formData: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onPhoneChange: PropTypes.func.isRequired
};

export default PersonalInfoSection;