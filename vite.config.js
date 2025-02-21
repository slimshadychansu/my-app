// 기존 vite.config.ts를 vite.config.js로 변경
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})