<template>
  <view class="report-page" :class="{ 'report-fullscreen': isFullscreen }">
    <!-- 自定义导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <text class="nav-back-icon">←</text>
      </view>
      <text class="nav-title">{{ reportName }}</text>
      <!-- #ifdef H5 -->
      <view class="nav-fullscreen-btn" @click="toggleFullscreen">
        <text class="nav-fullscreen-icon">⛶</text>
      </view>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <view class="nav-spacer"></view>
      <!-- #endif -->
    </view>

    <!-- WebView 区域 -->
    <view class="webview-wrap">
      <!-- H5 模式加载/错误状态（App 使用 cover-view 版本，在外部） -->
      <!-- #ifdef H5 -->
      <!-- 加载状态 -->
      <view v-if="showLoading" class="loading-overlay">
        <view class="loading-card">
          <view class="loading-spinner-wrap">
            <view class="loading-spinner"></view>
            <text class="loading-chart-icon">📊</text>
          </view>
          <text class="loading-text">正在加载报表</text>
          <text class="loading-sub">{{ reportName }}</text>
          <view class="loading-bar-wrap">
            <view class="loading-bar"></view>
          </view>
        </view>
      </view>

      <!-- 错误状态 -->
      <view v-if="loadError" class="error-overlay">
        <text class="error-icon">⚠️</text>
        <text class="error-text">报表加载失败</text>
        <text class="error-detail">{{ errorMsg }}</text>
        <view class="error-actions">
          <button class="retry-btn" @click="reloadWebView">
            <text>🔄 重新加载</text>
          </button>
          <button class="back-btn" @click="goBack">
            <text>← 返回首页</text>
          </button>
        </view>
        <view class="error-tips">
          <text class="tips-title">常见原因：</text>
          <text class="tips-item">• 网络连接异常</text>
          <text class="tips-item">• 服务端地址配置有误</text>
          <text class="tips-item">• 报表地址无法访问</text>
        </view>
      </view>
      <!-- #endif -->

      <!-- WebView (H5 模式使用 iframe) -->
      <!-- #ifdef H5 -->
      <web-view
        v-if="webViewUrl"
        :src="webViewUrl"
        @load="handleWebViewLoad"
        @error="onError"
      ></web-view>
      <!-- #endif -->
    </view>

    <!-- App 模式加载/错误覆盖层（cover-view 可覆盖原生 webview） -->
    <!-- #ifdef APP-PLUS -->
    <cover-view v-show="showLoading" class="loading-overlay">
      <cover-view class="loading-card">
        <cover-view class="loading-spinner-wrap">
          <cover-view class="loading-spinner"></cover-view>
        </cover-view>
        <cover-view class="loading-text">正在加载报表</cover-view>
        <cover-view class="loading-sub">{{ reportName }}</cover-view>
        <cover-view class="loading-bar-wrap">
          <cover-view class="loading-bar"></cover-view>
        </cover-view>
      </cover-view>
    </cover-view>
    <cover-view v-show="loadError" class="error-overlay">
      <cover-view class="error-text">报表加载失败</cover-view>
      <cover-view class="error-detail">{{ errorMsg }}</cover-view>
      <cover-view class="error-actions">
        <cover-view class="retry-btn" @click="reloadWebView">重新加载</cover-view>
        <cover-view class="back-btn" @click="goBack">返回首页</cover-view>
      </cover-view>
    </cover-view>
    <!-- #endif -->

    <!-- H5 全屏时浮动退出按钮 -->
    <!-- #ifdef H5 -->
    <view v-if="isFullscreen" class="fs-exit-btn" @click="toggleFullscreen">
      <text class="fs-exit-icon">⛶</text>
    </view>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { onLoad, onUnload, onBackPress, onReady } from '@dcloudio/uni-app'
import { getCookieHeader, log } from '@/utils/request.js'
import store from '@/store/index.js'

const reportName = ref('')
const reportUrl = ref('')
const reportEid = ref('')
const projectName = ref('')
const webViewUrl = ref('')
const showLoading = ref(true)
const loadError = ref(false)
const errorMsg = ref('')
const isFullscreen = ref(false)
let loadTimeout = null
// #ifdef APP-PLUS
let subWebView = null
// #endif

onLoad((options) => {
  initPage(options)
})

// #ifdef APP-PLUS
onReady(async () => {
  await requestCameraPermission()
  // 延迟创建 sub-webview，确保 DOM 完全就绪，避免框架测量时报 getBoundingClientRect 错误
  nextTick(() => {
    setTimeout(() => createSubWebView(), 100)
  })
})
// #endif

onUnload(() => {
  try {
    if (loadTimeout) clearTimeout(loadTimeout)
    // #ifdef APP-PLUS
    if (subWebView) {
      try { subWebView.close('none') } catch (e) {}
      subWebView = null
    }
    // #endif
  } catch(e) {
    log('[report] onUnload cleanup error:', e.message)
  }
})

// 硬件返回键：全屏时先退出全屏（仅 H5）
onBackPress(() => {
  // #ifdef H5
  if (isFullscreen.value) {
    toggleFullscreen()
    return true
  }
  // #endif
  return false
})

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

// #ifdef APP-PLUS
function createSubWebView() {
  if (!webViewUrl.value) return
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  const sysInfo = uni.getSystemInfoSync()
  const navHeight = sysInfo.statusBarHeight + 30

  // 先注入 cookie 到全局 CookieManager（必须在 webview.create 之前）
  // 这样 WebView 创建时发起的首次 HTTP 请求就能携带 session cookie
  injectCookiesToWebView(webViewUrl.value)

  subWebView = plus.webview.create(webViewUrl.value, 'report-sub-webview', {
    top: navHeight + 'px',
    left: '0px',
    width: sysInfo.windowWidth + 'px',
    height: (sysInfo.windowHeight - navHeight) + 'px'
  })

  // 授权 WebView 内的摄像头请求 + 配置 WebView 媒体设置
  setupWebViewCameraPermission(subWebView)

  subWebView.addEventListener('loaded', () => {
    // 注入 JS 补丁：修复 Android WebView 中扫码组件兼容性问题
    injectVideoPatch(subWebView)
    if (loadTimeout) clearTimeout(loadTimeout)
    setTimeout(() => { showLoading.value = false }, 600)
  }, false)

  subWebView.addEventListener('error', () => {
    if (loadTimeout) clearTimeout(loadTimeout)
    showLoading.value = false
    loadError.value = true
    errorMsg.value = '无法连接到 SmartChart 服务器，请检查网络和服务地址'
  }, false)

  page.$getAppWebview().append(subWebView)
}

// 请求 Android 运行时摄像头权限
function requestCameraPermission() {
  return new Promise((resolve) => {
    if (plus.os.name !== 'Android') { resolve(true); return }
    try {
      plus.android.requestPermissions(
        ['android.permission.CAMERA'],
        function(e) { resolve(e && e.granted && e.granted.length > 0) },
        function(e) { resolve(false) }
      )
    } catch(e) {
      log('[report] requestCameraPermission error:', e)
      resolve(false)
    }
  })
}

// 重写子 WebView 的 WebChromeClient，授权 getUserMedia 摄像头请求
function setupWebViewCameraPermission(webview) {
  if (plus.os.name !== 'Android') return
  try {
    var nativeWV = webview.nativeInstanceObject
    if (!nativeWV) return

    // 配置 WebView Settings：允许自动播放、DOM 存储、文件访问
    var settings = plus.android.invoke(nativeWV, 'getSettings')
    if (settings) {
      try { plus.android.invoke(settings, 'setMediaPlaybackRequiresUserGesture', false) } catch(e) {}
      try { plus.android.invoke(settings, 'setDomStorageEnabled', true) } catch(e) {}
      try { plus.android.invoke(settings, 'setAllowFileAccess', true) } catch(e) {}
      try { plus.android.invoke(settings, 'setAllowContentAccess', true) } catch(e) {}
      try { plus.android.invoke(settings, 'setJavaScriptEnabled', true) } catch(e) {}
    }

    var customClient = plus.android.implements('android.webkit.WebChromeClient', {
      'onPermissionRequest': function(request) {
        try { request.grant(request.getResources()) } catch(e) {}
      }
    })
    plus.android.invoke(nativeWV, 'setWebChromeClient', customClient)
  } catch(e) {
    log('[report] setupWebViewCameraPermission: 摄像头权限设置跳过 -', e.message)
  }
}

// 注入 cookie 到 WebView 原生 cookie 存储，使 WebView 内所有请求自动携带 session
function injectCookiesToWebView(urlStr) {
  const cookieStr = getCookieHeader()
  if (!cookieStr) {
    log('[report] injectCookiesToWebView: cookieJar 为空，跳过')
    return
  }

  try {
    // App 端 JS 运行时无 URL 构造函数，用正则提取 hostname
    var hostMatch = urlStr.match(/^https?:\/\/([^/:]+)/)
    if (!hostMatch) {
      log('[report] injectCookiesToWebView: 无法解析 host, url:', urlStr)
      return
    }
    const host = hostMatch[1]

    if (plus.os.name === 'Android') {
      const CookieManager = plus.android.importClass('android.webkit.CookieManager')
      const cm = CookieManager.getInstance()
      // 启用 WebView cookie 接受
      plus.android.invoke(cm, 'setAcceptCookie', true)
      // cookieJar 中每个 cookie 逐条设置（csrftoken, sessionid 等）
      cookieStr.split('; ').forEach(function(c) {
        plus.android.invoke(cm, 'setCookie', host, c)
      })
      plus.android.invoke(cm, 'flush')
      log('[report] Android cookies injected for', host)
    } else if (plus.os.name === 'iOS') {
      const NSHTTPCookieStorage = plus.ios.importClass('NSHTTPCookieStorage')
      const NSHTTPCookie = plus.ios.importClass('NSHTTPCookie')
      const storage = NSHTTPCookieStorage.sharedHTTPCookieStorage()
      // 接受所有 cookie
      plus.ios.invoke(storage, 'setCookieAcceptPolicy:', 0)
      cookieStr.split('; ').forEach(function(c) {
        var parts = c.split('=')
        if (parts.length >= 2) {
          var name = parts[0]
          var value = parts.slice(1).join('=')
          var props = plus.ios.newObject('NSMutableDictionary')
          plus.ios.invoke(props, 'setObject:forKey:', value, 'NSHTTPCookieValue')
          plus.ios.invoke(props, 'setObject:forKey:', name, 'NSHTTPCookieName')
          plus.ios.invoke(props, 'setObject:forKey:', '/', 'NSHTTPCookiePath')
          plus.ios.invoke(props, 'setObject:forKey:', host, 'NSHTTPCookieDomain')
          var cookie = NSHTTPCookie.cookieWithProperties(props)
          if (cookie) {
            plus.ios.invoke(storage, 'setCookie:', cookie)
          }
        }
      })
      log('[report] iOS cookies injected for', host)
    }
  } catch (e) {
    log('[report] injectCookiesToWebView error:', e.message)
  }
}

// 注入 JS 补丁：修复 Android WebView 中扫码问题
// 核心修复：
// 1. 假 OffscreenCanvas：绕过 smt_qrcode.js 中 z(t,e) 函数的变量遮蔽 bug（catch(e) 遮蔽 height 参数 e）
// 2. srcObject setter：设置流后自动 play() + 派发 loadeddata 事件（Android WebView 不自动触发）
// 3. videoWidth/videoHeight/readyState getter：视频流就绪但原生属性返回 0 时提供回退值
// 4. canvas getContext willReadFrequently:true：强制软件渲染，避免 drawImage(video) 产生黑帧
function injectVideoPatch(webview) {
  var patchJS = [
    '(function(){',
    '  if(window.__smtVideoPatched) return;',
    '  window.__smtVideoPatched=true;',
    '',
    '  // === 修复1：假 OffscreenCanvas ===',
    '  // smt_qrcode.js 的 z(t,e) 函数：catch(e) 的 e 遮蔽了参数 e(height)',
    '  // 导致 catch 块中 r.height=undefined→0，canvas 高度为 0 无法绘制',
    '  // 用假函数让 try 块直接返回普通 canvas，catch 块永远不执行',
    '  window.OffscreenCanvas=function(w,h){',
    '    var c=document.createElement("canvas");',
    '    c.width=w;c.height=h;',
    '    return c;',
    '  };',
    '  if(!window.OffscreenCanvasRenderingContext2D){',
    '    window.OffscreenCanvasRenderingContext2D=CanvasRenderingContext2D;',
    '  }',
    '',
    '  // === 修复2：srcObject setter 拦截 ===',
    '  // Android WebView 设置 video.srcObject=MediaStream 后 loadeddata 事件不触发',
    '  // 导致 smt_qrcode.js init() 中 await 等待 loadeddata 的 Promise 永远 pending',
    '  var soDesc=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,"srcObject");',
    '  if(soDesc&&soDesc.set){',
    '    var origSOSet=soDesc.set;',
    '    var origSOGet=soDesc.get;',
    '    Object.defineProperty(HTMLMediaElement.prototype,"srcObject",{',
    '      get:origSOGet,',
    '      set:function(stream){',
    '        origSOSet.call(this,stream);',
    '        if(stream&&stream.getVideoTracks){',
    '          var self=this;',
    '          var p=self.play();',
    '          if(p&&p.catch)p.catch(function(){});',
    '          setTimeout(function(){',
    '            try{self.dispatchEvent(new Event("loadeddata"))}catch(e){}',
    '          },500);',
    '        }',
    '      },',
    '      configurable:true',
    '    });',
    '  }',
    '',
    '  // === 修复3：videoWidth/videoHeight/readyState getter 回退 ===',
    '  // Android WebView 中视频流就绪后这些属性可能仍返回 0',
    '  var proto=HTMLVideoElement.prototype;',
    '  var vwDesc=Object.getOwnPropertyDescriptor(proto,"videoWidth");',
    '  var vhDesc=Object.getOwnPropertyDescriptor(proto,"videoHeight");',
    '  var rsDesc=Object.getOwnPropertyDescriptor(proto,"readyState");',
    '  if(vwDesc&&vwDesc.get){',
    '    var origVW=vwDesc.get;',
    '    Object.defineProperty(proto,"videoWidth",{',
    '      get:function(){',
    '        var w=origVW.call(this);',
    '        if(w>0) return w;',
    '        try{',
    '          if(this.srcObject&&this.srcObject.getVideoTracks){',
    '            var tracks=this.srcObject.getVideoTracks();',
    '            if(tracks.length>0){var s=tracks[0].getSettings();if(s&&s.width)return s.width;}',
    '          }',
    '        }catch(e){}',
    '        return this.offsetWidth||640;',
    '      },configurable:true',
    '    });',
    '  }',
    '  if(vhDesc&&vhDesc.get){',
    '    var origVH=vhDesc.get;',
    '    Object.defineProperty(proto,"videoHeight",{',
    '      get:function(){',
    '        var h=origVH.call(this);',
    '        if(h>0) return h;',
    '        try{',
    '          if(this.srcObject&&this.srcObject.getVideoTracks){',
    '            var tracks=this.srcObject.getVideoTracks();',
    '            if(tracks.length>0){var s=tracks[0].getSettings();if(s&&s.height)return s.height;}',
    '          }',
    '        }catch(e){}',
    '        return this.offsetHeight||480;',
    '      },configurable:true',
    '    });',
    '  }',
    '  if(rsDesc&&rsDesc.get){',
    '    var origRS=rsDesc.get;',
    '    Object.defineProperty(proto,"readyState",{',
    '      get:function(){',
    '        var rs=origRS.call(this);',
    '        if(rs>=2) return rs;',
    '        try{',
    '          if(this.srcObject&&this.srcObject.getVideoTracks){',
    '            var tracks=this.srcObject.getVideoTracks();',
    '            if(tracks.length>0&&tracks[0].readyState==="live")return 4;',
    '          }',
    '        }catch(e){}',
    '        return rs;',
    '      },configurable:true',
    '    });',
    '  }',
    '',
    '  // === 修复4：canvas getContext 加 willReadFrequently ===',
    '  // 强制软件渲染，避免 drawImage(video) 产生黑帧',
    '  var origGetCtx=HTMLCanvasElement.prototype.getContext;',
    '  HTMLCanvasElement.prototype.getContext=function(type,attrs){',
    '    if(type==="2d"){',
    '      if(!attrs)attrs={};',
    '      attrs.willReadFrequently=true;',
    '    }',
    '    return origGetCtx.call(this,type,attrs);',
    '  };',
    '',
    '})();'
  ].join('\n')

  try {
    webview.evalJS(patchJS)
  } catch(e) {
    log('[report] injectVideoPatch error:', e)
  }
}
// #endif

function initPage(options) {
  let opts = options || {}

  reportName.value = decodeURIComponent(opts.name || '未命名报表')
  reportUrl.value = decodeURIComponent(opts.url || '')
  reportEid.value = decodeURIComponent(opts.eid || '')
  projectName.value = decodeURIComponent(opts.project || '')

  uni.setNavigationBarTitle({ title: reportName.value })
  buildUrl()
}

function redirectToLogin() {
  store.setLoginStatus(false)
  uni.showToast({ title: '登录已过期，请重新登录', icon: 'none', duration: 2000 })
  setTimeout(() => {
    uni.reLaunch({ url: '/pages/login' })
  }, 300)
}

function buildUrl() {
  const server = store.state.server

  if (!server) {
    showLoading.value = false
    loadError.value = true
    errorMsg.value = '服务地址未配置'
    return
  }

  let url = reportUrl.value
  if (url && url.startsWith('/')) {
    url = server + url
  }
  if (!url) {
    showLoading.value = false
    loadError.value = true
    errorMsg.value = '报表地址为空'
    return
  }

  // #ifdef H5
  // H5 + Django 同域部署，cookie 自动生效
  // #endif
  webViewUrl.value = url

  loadTimeout = setTimeout(() => {
    if (showLoading.value) showLoading.value = false
  }, 15000)
}

function handleWebViewLoad() {
  // #ifdef H5
  // 同域 iframe：检测是否被重定向到 Django 登录页 /lg/
  try {
    const iframe = document.querySelector('iframe')
    if (iframe && iframe.contentWindow) {
      const iframeUrl = iframe.contentWindow.location.href
      if (iframeUrl.includes('/lg/')) {
        redirectToLogin()
        return
      }
    }
  } catch (e) {
    // 跨域 iframe 无法读取 URL（正常情况，不处理）
  }
  // #endif
  if (loadTimeout) clearTimeout(loadTimeout)
  setTimeout(() => { showLoading.value = false }, 600)
}

function onError(e) {
  if (loadTimeout) clearTimeout(loadTimeout)
  showLoading.value = false
  loadError.value = true
  errorMsg.value = '无法连接到 SmartChart 服务器，请检查网络和服务地址'
}

function reloadWebView() {
  loadError.value = false
  showLoading.value = true
  // #ifdef APP-PLUS
  if (subWebView) {
    try { subWebView.close('none') } catch (e) {}
    subWebView = null
  }
  buildUrl()
  if (webViewUrl.value) createSubWebView()
  // #endif
  // #ifdef H5
  webViewUrl.value = ''
  nextTick(() => { buildUrl() })
  // #endif
}

function goBack() {
  uni.navigateBack()
}
</script>

<style scoped>
.report-page {
  width: 100%;
  height: 100vh;
  background: #f5f6fa;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
/* 全屏模式：iframe 直接覆盖视口，导航栏隐藏 */
.report-fullscreen :deep(.nav-bar) {
  display: none !important;
}
.report-fullscreen :deep(uni-web-view),
.report-fullscreen :deep(iframe) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9999 !important;
}

/* === 自定义导航栏 === */
.nav-bar {
  flex-shrink: 0;
  height: 60rpx;
  background: linear-gradient(135deg, #1a73e8 0%, #5856d6 100%);
  display: flex;
  align-items: center;
  padding: 0 16rpx;
  padding-top: var(--status-bar-height, 0px);
  min-height: calc(60rpx + var(--status-bar-height, 44px));
}
.nav-back {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.nav-back-icon { font-size: 40rpx; color: #fff; }
.nav-title {
  flex: 1;
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 16rpx;
}
.nav-fullscreen-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.nav-fullscreen-icon { font-size: 36rpx; color: #fff; }
.nav-spacer {
  width: 72rpx;
  height: 72rpx;
  flex-shrink: 0;
}

/* === WebView 容器 === */
.webview-wrap {
  flex: 1;
  position: relative;
  overflow: hidden;
}
.webview-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
web-view { width: 100%; height: 100%; }

/* === 全屏浮动退出按钮 === */
.fs-exit-btn {
  position: fixed;
  right: 24rpx;
  bottom: 48rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(10px);
}
.fs-exit-icon { font-size: 40rpx; color: #fff; }

/* === 加载动画 === */
.loading-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(180deg, #1a1a2e 0%, #1a73e8 35%, #5856d6 65%, #f5f6fa 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.loading-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255,255,255,0.95);
  border-radius: 28rpx;
  padding: 60rpx 72rpx;
  box-shadow: 0 20rpx 60rpx rgba(0,0,0,0.12);
}
.loading-spinner-wrap {
  position: relative;
  width: 100rpx; height: 100rpx;
  margin-bottom: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-spinner {
  width: 80rpx; height: 80rpx;
  border: 5rpx solid #e8e8ed;
  border-top-color: #1a73e8;
  border-right-color: #5856d6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.loading-chart-icon {
  position: absolute;
  font-size: 34rpx;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8rpx;
}
.loading-sub {
  font-size: 26rpx;
  color: #8e8e93;
  margin-bottom: 28rpx;
  max-width: 400rpx;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.loading-bar-wrap {
  width: 260rpx;
  height: 6rpx;
  background: #e8e8ed;
  border-radius: 3rpx;
  overflow: hidden;
}
.loading-bar {
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg, #1a73e8, #5856d6);
  border-radius: 3rpx;
  animation: loadingSlide 1.5s ease-in-out infinite;
}
@keyframes loadingSlide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

/* === 错误状态 === */
.error-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(180deg, #fff 0%, #f5f6fa 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 40rpx;
}
.error-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
  animation: errorBounce 1s ease-in-out;
}
@keyframes errorBounce {
  0%, 100% { transform: translateY(0); }
  20% { transform: translateY(-20rpx); }
  40% { transform: translateY(0); }
  60% { transform: translateY(-10rpx); }
  80% { transform: translateY(0); }
}
.error-text { font-size: 36rpx; font-weight: 700; color: #1a1a2e; margin-bottom: 12rpx; }
.error-detail {
  font-size: 26rpx;
  color: #8e8e93;
  text-align: center;
  margin-bottom: 40rpx;
  line-height: 1.6;
  max-width: 500rpx;
}
.error-actions { display: flex; flex-direction: column; gap: 16rpx; width: 480rpx; margin-bottom: 40rpx; }
.retry-btn {
  width: 100%; height: 88rpx;
  background: linear-gradient(135deg, #1a73e8, #5856d6);
  color: #fff; font-size: 28rpx; font-weight: 600;
  border: none; border-radius: 16rpx;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(26, 115, 232, 0.25);
}
.retry-btn:active { opacity: 0.85; transform: scale(0.98); }
.back-btn {
  width: 100%; height: 88rpx;
  background: #fff; color: #1a73e8;
  font-size: 28rpx; font-weight: 600;
  border: 2rpx solid #e8e8ed; border-radius: 16rpx;
  display: flex; align-items: center; justify-content: center;
}
.back-btn:active { background: #f5f6fa; }
.error-tips {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  width: 480rpx;
}
.tips-title { font-size: 24rpx; font-weight: 600; color: #555; display: block; margin-bottom: 10rpx; }
.tips-item { font-size: 24rpx; color: #8e8e93; display: block; line-height: 1.8; }

/* === App 模式 cover-view 兼容样式（cover-view 不支持渐变/阴影/动画） === */
/* #ifdef APP-PLUS */
.nav-bar {
  background-color: #1a73e8;
}
.loading-overlay {
  background-color: #f5f6fa;
  width: 100%;
  height: 100%;
}
.loading-card {
  background-color: #ffffff;
}
.loading-spinner {
  border: 6rpx solid #1a73e8;
  border-radius: 50%;
}
.loading-bar {
  background-color: #1a73e8;
}
.error-overlay {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
}
.error-actions {
  width: 480rpx;
}
.retry-btn {
  background-color: #1a73e8;
  margin-bottom: 16rpx;
}
.back-btn {
  background-color: #ffffff;
}
/* #endif */
</style>
