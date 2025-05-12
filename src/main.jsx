import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import api from './utils/api'
import { setupGlobalApiDebugger } from './utils/apiDebugger'

// 환경 변수에 따라 목업 API 사용 여부 결정
// 개발 환경이거나 명시적으로 VITE_USE_MOCK_API=true로 설정된 경우에만 목업 사용
// const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.DEV;

// if (useMockApi) {
//   console.log('목업 API가 활성화되었습니다');
//   try {
//     setupMockApi(api);
//   } catch (error) {
//     console.error('목업 API 설정 중 오류 발생:', error);
//   }
// } else {
//   console.log('실제 API 서버에 연결됩니다');
// }

// API 디버깅 도구 설정 (개발 환경에서만)
setupGlobalApiDebugger(api);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)