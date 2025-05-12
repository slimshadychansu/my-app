export const setupInterceptors = (api) => {
    // 요청 인터셉터
    api.interceptors.request.use(
      (config) => {
        // 개발 환경에서 로깅
        if (import.meta.env.DEV) {
          console.log('요청 URL:', config.url);
          console.log('기본 URL:', config.baseURL);
        }
  
        // 토큰 처리
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${encodeURIComponent(token)}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  
    // 응답 인터셉터
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        // 에러 로깅 및 처리
        if (error.response) {
          // 상태 코드별 처리
          switch (error.response.status) {
            case 401:
              localStorage.removeItem('token');
              break;
            // 기타 상태 코드 처리
          }
        }
        return Promise.reject(error);
      }
    );
  };