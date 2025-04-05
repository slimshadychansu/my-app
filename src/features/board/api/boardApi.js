// src/features/board/api/boardApi.js
import api from '../../../utils/api';
import { ENDPOINTS } from '../../../api/endpoints';

/**
 * 게시글 목록 조회
 * @param {Object} params - 검색 및 필터링 파라미터
 * @returns {Promise} 게시글 목록 데이터
 */
export const fetchPosts = async (params = {}) => {
  try {
    const response = await api.get(ENDPOINTS.BOARD.LIST, { params });
    return response.data;
  } catch (error) {
    console.error('게시글 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 게시글 상세 조회
 * @param {string} id - 게시글 ID
 * @returns {Promise} 게시글 상세 데이터
 */
export const fetchPostById = async (id) => {
  try {
    const response = await api.get(ENDPOINTS.BOARD.DETAIL(id));
    return response.data;
  } catch (error) {
    console.error('게시글 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 게시글 작성
 * @param {FormData|Object} postData - 게시글 데이터 (이미지 포함 시 FormData)
 * @returns {Promise} 생성된 게시글 데이터
 */
export const createPost = async (postData) => {
  try {
    // FormData 여부 확인하여 헤더 설정
    const config = postData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    
    const response = await api.post(ENDPOINTS.BOARD.CREATE, postData, config);
    return response.data;
  } catch (error) {
    console.error('게시글 작성 실패:', error);
    throw error;
  }
};

/**
 * 게시글 수정
 * @param {string} id - 게시글 ID
 * @param {FormData|Object} postData - 게시글 데이터 (이미지 포함 시 FormData)
 * @returns {Promise} 수정된 게시글 데이터
 */
export const updatePost = async (id, postData) => {
  try {
    // FormData 여부 확인하여 헤더 설정
    const config = postData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    
    const response = await api.put(ENDPOINTS.BOARD.UPDATE(id), postData, config);
    return response.data;
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    throw error;
  }
};

/**
 * 게시글 삭제
 * @param {string} id - 게시글 ID
 * @returns {Promise} 삭제 결과 데이터
 */
export const deletePost = async (id) => {
  try {
    const response = await api.delete(ENDPOINTS.BOARD.DELETE(id));
    return response.data;
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    throw error;
  }
};

/**
 * 게시글 좋아요 토글
 * @param {string} id - 게시글 ID
 * @returns {Promise} 좋아요 결과 데이터
 */
export const toggleLike = async (id) => {
  try {
    const response = await api.post(`/board/${id}/like`);
    return response.data;
  } catch (error) {
    console.error('좋아요 토글 실패:', error);
    throw error;
  }
};

/**
 * 게시글 신고
 * @param {string} id - 게시글 ID
 * @param {Object} reportData - 신고 정보
 * @returns {Promise} 신고 결과 데이터
 */
export const reportPost = async (id, reportData) => {
  try {
    const response = await api.post(`/board/${id}/report`, reportData);
    return response.data;
  } catch (error) {
    console.error('게시글 신고 실패:', error);
    throw error;
  }
};

// 기본 내보내기로 API 함수들을 묶어서 제공
const boardApi = {
  fetchPosts,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  reportPost
};

export default boardApi;