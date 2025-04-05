// src/features/board/api/commentApi.js
import api from '../../../utils/api';
import { ENDPOINTS } from '../../../api/endpoints';

export const commentApi = {
  /**
   * 특정 게시글의 댓글 목록 조회
   * @param {string} postId - 게시글 ID
   * @returns {Promise} 댓글 목록 데이터
   */
  fetchCommentsByPostId: async (postId) => {
    try {
      const response = await api.get(ENDPOINTS.COMMENTS.LIST(postId));
      return response.data;
    } catch (error) {
      console.error('댓글 목록 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 댓글 생성
   * @param {Object} commentData - 댓글 정보
   * @returns {Promise} 생성된 댓글 데이터
   */
  createComment: async (commentData) => {
    try {
      const response = await api.post(ENDPOINTS.COMMENTS.CREATE, commentData);
      return response.data;
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      throw error;
    }
  },

  /**
   * 댓글 삭제
   * @param {string} commentId - 삭제할 댓글 ID
   * @returns {Promise} 삭제 결과 데이터
   */
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(ENDPOINTS.COMMENTS.DELETE(commentId));
      return response.data;
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw error;
    }
  }
};