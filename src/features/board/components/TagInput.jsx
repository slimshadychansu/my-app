// src/features/board/components/TagInput.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { searchTags } from '../api/tagApi';

/**
 * 태그 입력 컴포넌트
 * @param {Object} props
 * @param {Array} props.tags - 현재 태그 목록
 * @param {Function} props.onTagsChange - 태그 변경 핸들러
 * @param {Number} props.maxTags - 최대 태그 수 (기본값: 5)
 * @param {Boolean} props.disabled - 비활성화 여부
 */
function TagInput({ 
  tags = [], 
  onTagsChange = () => {}, 
  maxTags = 5,
  disabled = false,
  placeholder = "태그 입력 (최대 5개)" 
}) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // 태그 추가
  const addTag = (tag) => {
    // 입력값이 없는 경우
    if (!tag || !tag.trim()) return;
    
    // 중복 태그 방지
    if (tags.includes(tag.trim())) {
      setInputValue('');
      return;
    }
    
    // 최대 태그 수 제한
    if (tags.length >= maxTags) return;
    
    // 태그 추가
    onTagsChange([...tags, tag.trim()]);
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // 태그 삭제
  const removeTag = (tagToRemove) => {
    if (disabled) return;
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  // 엔터 키로 태그 추가
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // 자동완성 태그 검색
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (inputValue.trim().length >= 2) {
        setIsSearching(true);
        try {
          // 자동완성 API 호출
          const result = await searchTags(inputValue.trim());
          setSuggestions(result);
          setShowSuggestions(true);
        } catch (error) {
          console.error('태그 검색 실패:', error);
          // 오류 발생 시 간단한 로컬 필터링으로 대체
          const mockTags = ['레시피', '한식', '일식', '중식', '양식', '채식', '간편식', '아침', '점심', '저녁', '다이어트', '건강식'];
          setSuggestions(
            mockTags.filter(tag => tag.toLowerCase().includes(inputValue.toLowerCase()))
          );
          setShowSuggestions(true);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [inputValue]);

  return (
    <div className="mb-6">
      <label className="block mb-2 font-semibold dark:text-white">태그</label>
      
      {/* 태그 목록 */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div 
            key={index} 
            className={`bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center ${
              disabled ? 'opacity-70' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="text-gray-800 dark:text-gray-200">#{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 focus:outline-none"
                aria-label={`${tag} 태그 삭제`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* 태그 입력 */}
      <div className="relative">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.trim().length >= 2 && setShowSuggestions(true)}
            placeholder={tags.length >= maxTags ? "태그 최대 개수 도달" : placeholder}
            className="flex-1 p-2 border rounded-l-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={disabled || tags.length >= maxTags}
          />
          <button
            type="button"
            onClick={() => addTag(inputValue)}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!inputValue.trim() || tags.length >= maxTags || disabled}
          >
            추가
          </button>
        </div>
        
        {/* 태그 제안 */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => addTag(suggestion)}
                >
                  #{suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {isSearching && (
          <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        태그는 최대 {maxTags}개까지 입력할 수 있습니다
      </p>
    </div>
  );
}

TagInput.propTypes = {
  tags: PropTypes.array,
  onTagsChange: PropTypes.func,
  maxTags: PropTypes.number,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string
};

export default TagInput;