// API 디버깅 유틸리티

/**
 * API 요청을 테스트하고 결과를 콘솔에 출력하는 함수
 * @param {Object} apiInstance - API 인스턴스
 * @param {string} method - 요청 메서드 (get, post, put, delete)
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} data - 요청 데이터 (POST, PUT 요청에 사용)
 * @returns {Promise} - API 응답 결과
 */
export const testApiRequest = async (apiInstance, method, endpoint, data = null) => {
    console.group(`API 테스트: ${method.toUpperCase()} ${endpoint}`);
    console.log('요청 시간:', new Date().toLocaleTimeString());
    
    try {
      let response;
      
      switch (method.toLowerCase()) {
        case 'get':
          response = await apiInstance.get(endpoint);
          break;
        case 'post':
          response = await apiInstance.post(endpoint, data);
          break;
        case 'put':
          response = await apiInstance.put(endpoint, data);
          break;
        case 'delete':
          response = await apiInstance.delete(endpoint);
          break;
        default:
          throw new Error(`지원하지 않는 메서드: ${method}`);
      }
      
      console.log('성공 - 상태 코드:', response.status);
      console.log('응답 헤더:', response.headers);
      console.log('응답 데이터:', response.data);
      console.groupEnd();
      return response.data;
    } catch (error) {
      console.error('오류 발생:', error);
      
      if (error.response) {
        // 서버가 응답을 반환한 경우
        console.error('상태 코드:', error.response.status);
        console.error('응답 헤더:', error.response.headers);
        console.error('응답 데이터:', error.response.data);
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        console.error('응답 없음. 요청 객체:', error.request);
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error('요청 설정 오류:', error.message);
      }
      
      console.error('요청 설정:', error.config);
      console.groupEnd();
      throw error;
    }
  };
  
  // 전역 디버깅 도구 설정 (개발 환경에서만 사용)
  export const setupGlobalApiDebugger = (api) => {
    if (import.meta.env.DEV) {
      window.apiDebugger = {
        get: (endpoint) => testApiRequest(api, 'get', endpoint),
        post: (endpoint, data) => testApiRequest(api, 'post', endpoint, data),
        put: (endpoint, data) => testApiRequest(api, 'put', endpoint, data),
        delete: (endpoint) => testApiRequest(api, 'delete', endpoint),
        testAll: () => {
          console.log('모든 API 엔드포인트 테스트 시작...');
          
          // 주요 엔드포인트 자동 테스트
          return Promise.allSettled([
            testApiRequest(api, 'get', '/recipes'),
            testApiRequest(api, 'get', '/recipes/rec001'),
            testApiRequest(api, 'get', '/auth/profile')
          ]);
        }
      };
      
      console.log('API 디버거가 전역 객체에 설정되었습니다. 콘솔에서 apiDebugger 객체를 사용하여 API를 테스트할 수 있습니다.');
    }
  };