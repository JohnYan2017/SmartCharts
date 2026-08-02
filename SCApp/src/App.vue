<script setup>
import { onLaunch, onShow, onHide, onReady } from '@dcloudio/uni-app'
// #ifndef MP-WEIXIN
import { setOnAuthExpired } from '@/utils/request.js'
// #endif
import store from '@/store/index.js'

onLaunch(() => {
  // 闪屏手动关闭（HBuilderX Vue 3 编译器会强制 autoclose=false，必须手动关）
  // #ifdef APP-PLUS
  setTimeout(() => {
    plus.navigator.closeSplashscreen()
  }, 300)
  // #endif

  // #ifndef MP-WEIXIN
  // 注册全局认证失效回调：任何 API 返回 401/403 时自动跳登录页（小程序不参与，认证由 H5 处理）
  setOnAuthExpired(() => {
    store.setLoginStatus(false)
    uni.showToast({ title: '登录已过期，请重新登录', icon: 'none', duration: 2000 })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/login' })
    }, 300)
  })

  // 路由守卫：未登录时跳登录页（H5/App，小程序为 web-view 壳子，认证由 H5 页面处理）
  if (!store.state.server || !store.state.isLoggedIn) {
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/login' })
    }, 100)
  }
  // #endif
})

onReady(() => {
  // 页面渲染完成后再次确保闪屏关闭（双保险）
  // #ifdef APP-PLUS
  plus.navigator.closeSplashscreen()
  // #endif
})

onShow(() => {})
onHide(() => {})
</script>

<style>
/* === 全局重置 === */
page {
  height: 100%;
  overflow-x: hidden;
  background-color: #f5f6fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #1a1a2e;
  font-size: 28rpx;
  line-height: 1.5;
}
/* 全局 box-sizing */
view, text, input, button { box-sizing: border-box; }

/* 禁止选中文本 */
view, text { -webkit-user-select: none; }

/* === 页面过渡动画（Vue 3 class 命名） === */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateX(30rpx);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-30rpx);
}

/* === 按钮基础样式 === */
.btn-primary {
  background: linear-gradient(135deg, #1a73e8, #5856d6);
  color: #fff !important;
  border: none;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 14rpx;
  padding: 0 32rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-primary:active { opacity: 0.85; transform: scale(0.98); }

/* === FontAwesome 适配 === */
.fas, .far, .fab {
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  display: inline-block;
  font-variant: normal;
  text-rendering: auto;
}
.far { font-weight: 400; }
.fab { font-family: 'Font Awesome 6 Brands' !important; }
</style>
