<template>
  <view class="oauth-page">
    <!-- 顶部取消栏 -->
    <view class="oauth-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="oauth-nav">
        <text class="oauth-cancel" @click="handleCancel">取消</text>
        <text class="oauth-title">{{ pageTitle }}</text>
        <text class="oauth-placeholder"></text>
      </view>
    </view>

    <!-- 加载指示 -->
    <view v-if="webLoading" class="oauth-loading">
      <view class="loading-spinner"></view>
      <text class="loading-text">正在打开授权页面...</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onUnload } from '@dcloudio/uni-app'
import { setSessionCookie, log } from '@/utils/request.js'
import store from '@/store/index.js'

const pageTitle = ref('授权登录')
const webLoading = ref(true)
const statusBarHeight = ref(44)
let webview = null
let isHandled = false
let oauthTimeout = null  // 30s 超时保护

onMounted(() => {
  // 每次进入页面重置状态（修复：取消后再次进入 isHandled 仍为 true 的 bug）
  isHandled = false

  // 获取状态栏高度
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 44

  // 从 storage 读取 OAuth URL（login 页面存入）
  const oauthUrl = uni.getStorageSync('oauth_url')
  if (!oauthUrl) {
    uni.showToast({ title: '授权地址为空', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 1000)
    return
  }
  uni.removeStorageSync('oauth_url')

  // 获取当前页面的 plus.webview 实例
  // #ifndef H5
  initWebview(oauthUrl)
  // #endif

  // 超时保护：30s 内无回调则自动取消
  oauthTimeout = setTimeout(() => {
    if (!isHandled) {
      isHandled = true
      webLoading.value = false
      uni.showToast({ title: '授权超时，请重试', icon: 'none', duration: 2000 })
      setTimeout(() => {
        if (webview) { try { webview.close('auto') } catch (e) {} }
        uni.navigateBack()
      }, 800)
    }
  }, 30000)
})

// 使用 onUnload（uni-app 页面生命周期）替代 onUnmounted，确保系统返回键等场景也能清理
onUnload(() => {
  if (oauthTimeout) { clearTimeout(oauthTimeout); oauthTimeout = null }
  // 释放 webview 实例，避免内存泄漏
  if (webview) {
    try { webview.close('auto') } catch (e) {}
    webview = null
  }
})

// #ifndef H5
function initWebview(oauthUrl) {
  const pageWv = plus.webview.currentWebview()

  // 创建子 webview 加载 OAuth URL，留出顶部导航栏空间
  const headerH = statusBarHeight.value + 44
  webview = plus.webview.create(oauthUrl, 'oauth-wv', {
    top: headerH + 'px',
    bottom: '0px',
    statusbar: { background: '#1a1a2e' }
  })
  pageWv.append(webview)

  // 监听页面加载完成
  webview.addEventListener('loaded', () => {
    webLoading.value = false
    log('[oauth-wv] loaded, url:', webview.getURL())
  }, false)

  // 拦截 URL 跳转：捕获 OAuth 回调后的 redirect('/')
  webview.addEventListener('overrideUrlLoading', (e) => {
    const url = e.url || ''
    log('[oauth-wv] overrideUrlLoading:', url)

    // 回调完成后后端 redirect('/')，URL 以服务器根路径结尾
    if ((url.endsWith('/') || url.endsWith('/echart/') || url.endsWith('/echart')) && !isHandled) {
      e.cancel = true
      isHandled = true
      handleOAuthComplete()
    }
  }, false)

  // 加载错误处理
  webview.addEventListener('error', (e) => {
    log('[oauth-wv] error:', e)
    webLoading.value = false
  }, false)
}

function handleOAuthComplete() {
  if (oauthTimeout) { clearTimeout(oauthTimeout); oauthTimeout = null }
  webLoading.value = true
  log('[oauth-wv] OAuth callback detected, extracting session...')

  // 尝试用原生 CookieManager 提取 sessionid（Android）
  let sid = ''
  try {
    const server = store.state.server || ''
    const host = server.replace(/^https?:\/\//, '').split('/')[0]

    // Android: android.webkit.CookieManager
    if (plus.os.name === 'Android') {
      const CookieManager = plus.android.importClass('android.webkit.CookieManager')
      const cm = CookieManager.getInstance()
      const cookies = cm.getCookie(host)
      log('[oauth-wv] Android cookies:', cookies ? cookies.substring(0, 60) + '...' : '(null)')
      if (cookies) {
        const m = cookies.match(/sessionid=([^;\s]+)/)
        if (m) sid = m[1]
      }
    }
    // iOS: NSHTTPCookieStorage
    else if (plus.os.name === 'iOS') {
      const NSHTTPCookieStorage = plus.ios.importClass('NSHTTPCookieStorage')
      const storage = NSHTTPCookieStorage.sharedHTTPCookieStorage()
      const cookies = storage.cookies()
      if (cookies) {
        const count = plus.ios.invoke(cookies, 'count')
        for (let i = 0; i < count; i++) {
          const cookie = cookies.objectAtIndex(i)
          const name = plus.ios.invoke(cookie, 'name') + ''
          if (name === 'sessionid') {
            sid = plus.ios.invoke(cookie, 'value') + ''
            break
          }
        }
      }
      log('[oauth-wv] iOS sessionid:', sid ? sid.substring(0, 16) + '...' : '(null)')
    }
  } catch (e) {
    log('[oauth-wv] native cookie extract failed:', e.message)
  }

  // 备用方案：用 evalJS 从 webview 页面内容判断登录结果
  if (!sid && webview) {
    try {
      webview.evalJS('document.body && document.body.innerText', (bodyText) => {
        log('[oauth-wv] page body:', bodyText ? bodyText.substring(0, 80) : '(empty)')
        // 尝试从 body 解析 JSON 响应（后端 state=app 时返回 JSON）
        try {
          const data = JSON.parse(bodyText)
          if (data && data.success) {
            log('[oauth-wv] login JSON success, username:', data.username)
          }
        } catch (e) {}
        finishLogin(sid)
      })
      return
    } catch (e) {
      log('[oauth-wv] evalJS failed:', e.message)
    }
  }

  finishLogin(sid)
}

function finishLogin(sid) {
  if (sid) {
    setSessionCookie(sid)
    log('[oauth-wv] session injected, navigating to index')
  } else {
    log('[oauth-wv] WARNING: no sessionid extracted, login may fail')
  }

  // 设置登录状态（即使没有 sid 也跳转，index 页面会做 session 校验）
  store.setLoginStatus(true)
  setTimeout(() => {
    uni.reLaunch({ url: '/pages/index' })
  }, 300)
}
// #endif

function handleCancel() {
  isHandled = true
  if (oauthTimeout) { clearTimeout(oauthTimeout); oauthTimeout = null }
  if (webview) {
    try { webview.close('auto') } catch (e) {}
  }
  uni.navigateBack()
}
</script>

<style scoped>
.oauth-page {
  flex: 1;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
}

.oauth-header {
  background: #1a1a2e;
  z-index: 999;
  position: relative;
}

.oauth-nav {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.oauth-cancel {
  color: #fff;
  font-size: 16px;
  padding: 8px 4px;
  opacity: 0.9;
}

.oauth-title {
  color: #fff;
  font-size: 17px;
  font-weight: 600;
}

.oauth-placeholder {
  width: 50px;
}

.oauth-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 998;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255,255,255,0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

.loading-text {
  color: rgba(255,255,255,0.7);
  font-size: 14px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
