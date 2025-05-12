import axios from 'axios';
import { setupInterceptors } from './interceptors';

const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = isDevelopment ? '/api' : import.meta.env.VITE_API_BASE_URL;

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 인터셉터 설정 적용
setupInterceptors(apiInstance);

export default apiInstance;