// src/features/board/api/fileUploadApi.js
import api from '../../../utils/api';

/**
 * 이미지 파일 업로드
 * @param {FormData} formData - 이미지 파일을 포함한 FormData 객체
 * @returns {Promise} 업로드된 이미지 정보
 */
export const uploadImages = async (formData) => {
  try {
    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        // 업로드 진행률 계산 (0 ~ 100)
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`업로드 진행률: ${percentCompleted}%`);
        
        // 여기에 진행률 상태 업데이트 로직을 추가할 수 있음
      }
    });
    return response.data;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    
    // 더 상세한 오류 메시지 생성
    let errorMessage = '이미지 업로드에 실패했습니다.';
    
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 413) {
        errorMessage = '파일 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다.';
      } else if (status === 415) {
        errorMessage = '지원하지 않는 파일 형식입니다. JPG, PNG, GIF 형식만 가능합니다.';
      } else if (data && data.message) {
        errorMessage = data.message;
      }
    } else if (error.request) {
      // 요청은 보냈으나 응답을 받지 못한 경우
      errorMessage = '서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.';
    }
    
    // 오류 객체 확장 및 전달
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    throw enhancedError;
  }
};

/**
 * 이미지 삭제
 * @param {string} imageId - 삭제할 이미지 ID 또는 경로
 * @returns {Promise} 삭제 결과
 */
export const deleteImage = async (imageId) => {
  try {
    const response = await api.delete(`/upload/images/${imageId}`);
    return response.data;
  } catch (error) {
    console.error('이미지 삭제 실패:', error);
    
    // 오류 메시지 생성
    let errorMessage = '이미지 삭제에 실패했습니다.';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * 임시 이미지 URL 생성 (개발 환경에서 사용)
 * @param {File} file - 이미지 파일
 * @returns {string} 임시 이미지 URL
 */
export const createTempImageUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * 이미지 파일 유효성 검사
 * @param {File} file - 검사할 이미지 파일
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateImageFile = (file) => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!file) {
    return { isValid: false, message: '파일이 선택되지 않았습니다.' };
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { isValid: false, message: '이미지 파일만 업로드 가능합니다. (JPG, PNG, GIF, WEBP)' };
  }
  
  if (file.size > MAX_SIZE) {
    return { isValid: false, message: '파일 크기는 5MB 이하여야 합니다.' };
  }
  
  return { isValid: true, message: '' };
};

// 기본 내보내기 추가
const fileUploadApi = {
  uploadImages,
  deleteImage,
  createTempImageUrl,
  validateImageFile
};

export default fileUploadApi;