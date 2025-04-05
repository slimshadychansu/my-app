// src/features/auth/components/PreferencesSection.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { SPICY_LEVELS, COOKING_TIME_RANGE } from '../constants/formOptions';

function PreferencesSection({ formData, onChange }) {
  return (
    <div className="space-y-4 mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
        요리 환경설정
      </h3>
      
      {/* 매운맛 선호도 */}
      <div>
        <label htmlFor="spicyLevel" className="block mb-1 font-medium text-gray-700 dark:text-white">
          매운맛 선호도
        </label>
        <select
          id="spicyLevel"
          name="spicyLevel"
          value={formData.spicyLevel}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {SPICY_LEVELS.map(level => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* 요리 시간 */}
      <div>
        <label htmlFor="cookingTime" className="block mb-1 font-medium text-gray-700 dark:text-white">
          선호하는 요리 시간 (분)
        </label>
        <div className="flex items-center">
          <input
            id="cookingTime"
            type="range"
            name="cookingTime"
            min={COOKING_TIME_RANGE.min}
            max={COOKING_TIME_RANGE.max}
            step={COOKING_TIME_RANGE.step}
            value={formData.cookingTime}
            onChange={onChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300 min-w-[4rem] text-center">
            {formData.cookingTime}분
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>빠른 요리</span>
          <span>여유있는 요리</span>
        </div>
      </div>
      
      {/* 채식 여부 */}
      <div>
        <label className="flex items-center text-gray-700 dark:text-white cursor-pointer">
          <input
            type="checkbox"
            name="vegetarian"
            checked={formData.vegetarian}
            onChange={onChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="ml-2">채식주의자</span>
        </label>
      </div>
    </div>
  );
}

PreferencesSection.propTypes = {
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default PreferencesSection;