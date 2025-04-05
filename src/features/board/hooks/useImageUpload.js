// src/features/board/hooks/useImageUpload.js
import { useState, useCallback, useEffect } from 'react';

/**
 * 이미지 업로드 및 미리보기 관련 기능을 제공하는 커스텀 훅
 * @param {Array} initialImages - 초기 이미지 배열
 * @param {Function} onImagesChange - 이미지 변경 시 호출될 콜백 함수
 * @param {Number} maxImageCount - 최대 업로드 가능한 이미지 수
 * @returns {Object} 이미지 관련 상태 및 기능
 */
export function useImageUpload(initialImages = [], onImagesChange = () => {}, maxImageCount = 5) {
  const [images, setImages] = useState(initialImages);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState([]);
  
  // 컴포넌트 마운트 시 초기 이미지의 미리보기 URL 생성
  useEffect(() => {
    // 기존 미리보기 URL 해제
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    // 새 미리보기 URL 생성
    const newPreviewUrls = initialImages.map(image => {
      // 이미 URL인 경우 그대로 사용
      if (typeof image === 'string') return image;
      // File 객체인 경우 미리보기 URL 생성
      return URL.createObjectURL(image);
    });
    
    setPreviewUrls(newPreviewUrls);
    setImages(initialImages);
    
    // 컴포넌트 언마운트 시 URL 정리
    return () => {
      newPreviewUrls.forEach(url => {
        if (typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [initialImages]);
  
  /**
   * 파일 유효성 검사
   * @param {File} file - 검사할 파일
   * @returns {String|null} 오류 메시지 또는 null
   */
  const validateFile = useCallback((file) => {
    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      return `${file.name}은(는) 이미지 파일이 아닙니다.`;
    }
    
    // 파일 크기 제한 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return `${file.name}의 크기가 5MB를 초과합니다.`;
    }
    
    return null;
  }, []);
  
  /**
   * 파일 목록 처리
   * @param {FileList|Array} fileList - 파일 목록
   */
  const handleFiles = useCallback((fileList) => {
    const newErrors = [];
    const filesToAdd = [];
    const newPreviewUrls = [];
    
    // 최대 이미지 수 체크
    if (images.length >= maxImageCount) {
      newErrors.push(`이미지는 최대 ${maxImageCount}개까지만 업로드할 수 있습니다.`);
      setErrors(newErrors);
      return;
    }
    
    // 추가 가능한 이미지 개수
    const remainingSlots = maxImageCount - images.length;
    
    // 파일 처리
    for (let i = 0; i < Math.min(fileList.length, remainingSlots); i++) {
      const file = fileList[i];
      const error = validateFile(file);
      
      if (error) {
        newErrors.push(error);
      } else {
        filesToAdd.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      }
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
    }
    
    if (filesToAdd.length > 0) {
      const updatedImages = [...images, ...filesToAdd];
      setImages(updatedImages);
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      onImagesChange(updatedImages);
    }
  }, [images, maxImageCount, onImagesChange, validateFile]);
  
  /**
   * 이미지 삭제
   * @param {Number} index - 삭제할 이미지 인덱스
   */
  const removeImage = useCallback((index) => {
    // 미리보기 URL 해제
    const urlToRevoke = previewUrls[index];
    if (urlToRevoke && urlToRevoke.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRevoke);
    }
    
    // 이미지 및 미리보기 URL 상태 업데이트
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviewUrls = previewUrls.filter((_, i) => i !== index);
    
    setImages(updatedImages);
    setPreviewUrls(updatedPreviewUrls);
    onImagesChange(updatedImages);
    
    // 에러 상태 초기화
    if (errors.length > 0) {
      setErrors([]);
    }
  }, [images, previewUrls, errors, onImagesChange]);
  
  /**
   * 파일 선택 이벤트 핸들러
   * @param {Event} e - 파일 선택 이벤트
   */
  const handleFileSelect = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    
    // 동일 파일 재선택 가능하도록 input 값 초기화
    e.target.value = '';
  }, [handleFiles]);
  
  /**
   * 드래그 오버 이벤트 핸들러
   * @param {Event} e - 드래그 오버 이벤트
   */
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  /**
   * 드래그 리브 이벤트 핸들러
   * @param {Event} e - 드래그 리브 이벤트
   */
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  /**
   * 드롭 이벤트 핸들러
   * @param {Event} e - 드롭 이벤트
   */
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);
  
  /**
   * 에러 초기화
   */
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);
  
  return {
    images,
    previewUrls,
    isDragging,
    errors,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
    clearErrors
  };
}