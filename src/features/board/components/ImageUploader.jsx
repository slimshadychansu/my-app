// src/features/board/components/ImageUploader.jsx
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * 이미지 업로드 컴포넌트
 * @param {Object} props
 * @param {Array} props.previewUrls - 이미지 미리보기 URL 배열
 * @param {Boolean} props.isDragging - 드래그 상태
 * @param {Array} props.errors - 에러 메시지 배열
 * @param {Function} props.onFileSelect - 파일 선택 핸들러
 * @param {Function} props.onDragOver - 드래그 오버 핸들러
 * @param {Function} props.onDragLeave - 드래그 리브 핸들러
 * @param {Function} props.onDrop - 드롭 핸들러
 * @param {Function} props.onRemoveImage - 이미지 삭제 핸들러
 * @param {Number} props.maxImageCount - 최대 이미지 수
 */
function ImageUploader({
  previewUrls = [],
  isDragging = false,
  errors = [],
  onFileSelect = () => {},
  onDragOver = () => {},
  onDragLeave = () => {},
  onDrop = () => {},
  onRemoveImage = () => {},
  maxImageCount = 5,
  disabled = false
}) {
  const fileInputRef = useRef(null);

  // 미리보기 이미지 URL 생성
  const getPreviewUrl = (file) => {
    if (typeof file === 'string') return file;
    if (file instanceof File) return URL.createObjectURL(file);
    return '';
  };

  // 파일 크기 포맷팅
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 font-semibold dark:text-white">이미지 첨부</label>
      
      {/* 에러 메시지 */}
      {errors.length > 0 && (
        <div className="mb-3 bg-red-50 border border-red-200 p-3 rounded-lg dark:bg-red-900/20 dark:border-red-800">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 dark:text-red-400">{error}</p>
          ))}
        </div>
      )}
      
      {/* 드래그 앤 드롭 영역 */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
            ${previewUrls.length >= maxImageCount || disabled ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">이미지를 여기에 드래그하거나 클릭하여 업로드하세요</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">최대 {maxImageCount}개, JPEG, PNG, GIF 파일 지원 (파일당 최대 5MB)</p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          multiple 
          onChange={onFileSelect}
          disabled={previewUrls.length >= maxImageCount || disabled}
        />
      </div>
      
      {/* 업로드 상태 표시 */}
      <div className="flex justify-between mt-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {previewUrls.length}/{maxImageCount} 이미지 업로드됨
        </p>
      </div>
      
      {/* 이미지 미리보기 */}
      {previewUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {previewUrls.map((preview, index) => (
            <div key={index} className="relative group">
              <img 
                src={getPreviewUrl(preview)} 
                alt={`미리보기 ${index + 1}`} 
                className="w-full h-40 object-cover rounded-lg shadow-sm dark:border dark:border-gray-700"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                disabled={disabled}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="이미지 삭제"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              {/* 파일 정보 표시 */}
              {preview instanceof File && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 rounded-b-lg truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {preview.name.length > 18 ? `${preview.name.slice(0, 15)}...` : preview.name}
                  <span className="block">{formatFileSize(preview.size)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

ImageUploader.propTypes = {
  previewUrls: PropTypes.array,
  isDragging: PropTypes.bool,
  errors: PropTypes.array,
  onFileSelect: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func,
  onRemoveImage: PropTypes.func,
  maxImageCount: PropTypes.number,
  disabled: PropTypes.bool
};

export default ImageUploader;