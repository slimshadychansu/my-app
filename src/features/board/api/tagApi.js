// src/features/board/api/tagApi.js
import api from '../../../utils/api';

/**
 * 인기 태그 목록 조회
 * @param {number} limit - 조회할 태그 개수
 * @returns {Promise} 인기 태그 목록
 */
export const fetchPopularTags = async (limit = 10) => {
  try {
    const response = await api.get('/board/popular-tags', { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('인기 태그 조회 실패:', error);
    // API 연결 실패 시 임시 데이터 반환 (프로덕션에서는 제거 필요)
    if (process.env.NODE_ENV !== 'production') {
      console.warn('임시 태그 데이터 사용 중 (개발 모드)');
      return ['한식', '간단요리', '다이어트', '살림꿀팁', '초보요리', '김치찌개', '파스타', '비건', '건강식', '일식'];
    }
    throw error;
  }
};

/**
 * 태그 자동완성 검색
 * @param {string} keyword - 검색 키워드
 * @param {number} limit - 결과 개수 제한
 * @returns {Promise} 자동완성 태그 목록
 */
export const searchTags = async (keyword, limit = 5) => {
  try {
    const response = await api.get('/board/tags/search', { 
      params: { keyword, limit } 
    });
    return response.data;
  } catch (error) {
    console.error('태그 검색 실패:', error);
    
    // API 연결 실패 시 임시 로직 (개발 환경에서만 사용)
    if (process.env.NODE_ENV !== 'production') {
      console.warn('임시 태그 검색 로직 사용 중 (개발 모드)');
      // 임시 태그 목록
      const mockTags = [
        '한식', '한끼식사', '한방요리', '한우', '한식디저트',
        '일식', '일품요리', '이탈리안', '일상', '이유식',
        '중식', '저칼로리', '전통요리', '제철요리', '젤리',
        '양식', '야식', '야채요리', '양념장', '양파요리',
        '건강식', '계란요리', '고기요리', '간식', '국수',
        '다이어트', '닭요리', '두부요리', '달걀', '된장찌개',
        '비건', '반찬', '브런치', '밥', '불고기',
        '간단요리', '김치', '깻잎', '고구마', '갈비찜',
        '매운맛', '만두', '무침', '메인요리', '미역국',
        '초보요리', '찌개', '찜', '채소', '치킨'
      ];
      
      // 검색어로 필터링
      return mockTags.filter(tag => tag.includes(keyword)).slice(0, limit);
    }
    
    throw error;
  }
};

/**
 * 게시글에 태그 추가
 * @param {string} postId - 게시글 ID
 * @param {string[]} tags - 추가할 태그 목록
 * @returns {Promise} 태그 추가 결과
 */
export const addTagsToPost = async (postId, tags) => {
  try {
    const response = await api.post(`/board/${postId}/tags`, { tags });
    return response.data;
  } catch (error) {
    console.error('태그 추가 실패:', error);
    throw error;
  }
};

/**
 * 게시글에서 태그 삭제
 * @param {string} postId - 게시글 ID
 * @param {string} tag - 삭제할 태그
 * @returns {Promise} 태그 삭제 결과
 */
export const removeTagFromPost = async (postId, tag) => {
  try {
    const response = await api.delete(`/board/${postId}/tags/${tag}`);
    return response.data;
  } catch (error) {
    console.error('태그 삭제 실패:', error);
    throw error;
  }
};

/**
 * 특정 태그로 게시글 검색
 * @param {string} tag - 검색할 태그
 * @param {Object} params - 검색 파라미터 (페이지, 정렬 등)
 * @returns {Promise} 게시글 목록
 */
export const getPostsByTag = async (tag, params = {}) => {
  try {
    const response = await api.get('/board', {
      params: { tag, ...params }
    });
    return response.data;
  } catch (error) {
    console.error('태그 기반 게시글 검색 실패:', error);
    throw error;
  }
};

// 기본 내보내기
const tagApi = {
  fetchPopularTags,
  searchTags,
  addTagsToPost,
  removeTagFromPost,
  getPostsByTag
};

export default tagApi;