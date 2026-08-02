import { createSSRApp } from 'vue'
import App from './App.vue'

// H5 开发模式：启用同源代理绕过跨域 CSRF
// 生产部署到 Django 同域后不需要代理
// #ifdef H5
import { enableDevProxy } from '@/utils/request.js'
if (!import.meta.env.PROD) {
  enableDevProxy()
}
// #endif

export function createApp() {
  const app = createSSRApp(App)
  return { app }
}
