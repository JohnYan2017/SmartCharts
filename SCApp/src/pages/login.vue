<template>
  <view class="login-page">
    <!-- 装饰性渐变背景 -->
    <view class="bg-decoration">
      <view class="bg-circle bg-circle-1"></view>
      <view class="bg-circle bg-circle-2"></view>
      <view class="bg-circle bg-circle-3"></view>
    </view>

    <!-- Logo 区域 -->
    <view class="logo-section">
      <image class="logo-icon" src="/static/logo.png" mode="aspectFit" />
      <text class="app-desc">数据驱动决策 · 移动端数据看板</text>
    </view>

    <!-- 表单卡片 -->
    <view class="form-section">
      <!-- 用户名 -->
      <view class="input-group">
        <text class="input-label">用户名</text>
        <view class="input-wrap">
          <text class="input-prefix">👤</text>
          <input
            class="input-field"
            v-model="username"
            placeholder="请输入用户名"
            placeholder-style="color:#c7c7cc"
            type="text"
          />
        </view>
      </view>

      <!-- 密码 -->
      <view class="input-group">
        <text class="input-label">密码</text>
        <view class="input-wrap">
          <text class="input-prefix">🔒</text>
          <input
            class="input-field"
            v-model="password"
            placeholder="请输入密码"
            placeholder-style="color:#c7c7cc"
            :type="showPassword ? 'text' : 'password'"
          />
          <text class="pwd-toggle" @click="showPassword = !showPassword">{{ showPassword ? '🙈' : '👁' }}</text>
        </view>
      </view>

      <!-- 记住密码 -->
      <view class="remember-row" @click="rememberPwd = !rememberPwd">
        <view class="remember-check">
          <text class="check-box" :class="{ checked: rememberPwd }">{{ rememberPwd ? '✓' : '' }}</text>
          <text class="remember-label">记住密码</text>
        </view>
      </view>

      <!-- #ifndef H5 -->
      <!-- 高级选项（App/小程序端，H5 同域部署无需服务器地址） -->
      <view class="advanced-toggle" @click="showAdvanced = !showAdvanced">
        <text class="advanced-label">⚙ 高级选项</text>
        <text class="arrow" :class="{ rotated: showAdvanced }">›</text>
      </view>
      <view v-if="showAdvanced" class="advanced-section">
        <view class="input-group">
          <text class="input-label">服务器地址</text>
          <view class="input-wrap">
            <text class="input-prefix">🔗</text>
            <input
              class="input-field"
              v-model="server"
              placeholder="https://smartchart.cn"
              placeholder-style="color:#c7c7cc"
              type="text"
              @blur="formatServer"
              @focus="showHistory = true"
            />
            <text v-if="serverHistory.length" class="history-toggle" @click.stop="showHistory = !showHistory">▼</text>
          </view>
          <!-- 服务器历史列表 -->
          <view v-if="showHistory && serverHistory.length" class="server-history">
            <view
              v-for="(h, hi) in serverHistory"
              :key="hi"
              class="history-item"
              :class="{ active: h === server }"
              @click="selectHistory(h)"
            >
              <text class="history-icon">🕐</text>
              <text class="history-url">{{ h }}</text>
            </view>
          </view>
        </view>
      </view>
      <!-- #endif -->

      <!-- 登录按钮 -->
      <button
        class="btn-login"
        :class="{ loading: loading }"
        :disabled="loading"
        @click="handleLogin"
      >
        <text v-if="loading" class="btn-loading-spinner"></text>
        <text>{{ loading ? ' 登录中...' : '登 录' }}</text>
      </button>

      <!-- 第三方快捷登录 -->
      <view class="social-login-section">
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">其他方式</text>
          <view class="divider-line"></view>
        </view>
        <view class="social-login-row">
          <!-- 微信（仅小程序/App） -->
          <!-- #ifndef H5 -->
          <view class="social-btn-wrap" @click="handleWxLogin">
            <view class="social-btn social-btn-wx">
              <image class="social-btn-img" src="/static/icons/wechat.svg" mode="aspectFit" />
            </view>
            <text class="social-btn-label">微信</text>
          </view>
          <!-- #endif -->
          <view class="social-btn-wrap" @click="handleOAuthLogin('qiwei', '企微')">
            <view class="social-btn social-btn-qw">
              <image class="social-btn-img" src="/static/icons/wecom.svg" mode="aspectFit" />
            </view>
            <text class="social-btn-label">企微</text>
          </view>
          <view class="social-btn-wrap" @click="handleOAuthLogin('dingding', '钉钉')">
            <view class="social-btn social-btn-dd">
              <image class="social-btn-img" src="/static/icons/dingtalk.svg" mode="aspectFit" />
            </view>
            <text class="social-btn-label">钉钉</text>
          </view>
        </view>
      </view>

      <!-- 错误提示 -->
      <view v-if="errorMsg" class="error-msg">
        <text class="error-icon-inline">⚠️</text>
        <text>{{ errorMsg }}</text>
      </view>
    </view>

    <!-- 底部提示 -->
    <!-- #ifndef H5 -->
    <view class="footer-tip">
      <text>首次使用请先配置 SmartChart 服务端地址</text>
    </view>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { login, wxLogin, oauthLogin } from '@/api/smartchart.js'
import store from '@/store/index.js'
// #ifdef H5
import { checkSession } from '@/utils/request.js'
// #endif

// 已登录状态下直接跳到列表页
// #ifdef H5
onMounted(async () => {
  if (store.state.isLoggedIn && store.state.server) {
    const valid = await checkSession(store.state.server)
    if (valid) {
      uni.reLaunch({ url: '/pages/index' })
    } else {
      store.setLoginStatus(false)
    }
  }
})
// #endif

const server = ref(store.state.server || '')
const username = ref(store.state.username || '')
const password = ref(store.state.savedPassword || '')

const showAdvanced = ref(!store.state.server)
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const rememberPwd = ref(store.state.rememberPwd)
const showHistory = ref(false)

const serverHistory = computed(() => store.state.serverHistory || [])

function selectHistory(h) {
  server.value = h
  showHistory.value = false
}

function formatServer() {
  let url = server.value.trim()
  if (url && !url.startsWith('http')) {
    url = 'https://' + url
  }
  server.value = url.replace(/\/+$/, '')
  showHistory.value = false
}

async function handleLogin() {
  errorMsg.value = ''
  // #ifndef H5
  if (!server.value.trim()) { errorMsg.value = '请输入服务器地址'; return }
  // #endif
  if (!username.value.trim()) { errorMsg.value = '请输入用户名'; return }
  if (!password.value) { errorMsg.value = '请输入密码'; return }
  // #ifndef H5
  formatServer()
  store.setServer(server.value)
  // #endif
  store.setUsername(username.value.trim())
  loading.value = true
  try {
    const result = await login(store.state.server, username.value.trim(), password.value)
    if (result.success) {
      store.setLoginStatus(true)
      // #ifndef H5
      store.addServerHistory(server.value)
      // #endif
      store.setRememberPwd(rememberPwd.value, password.value)
      uni.reLaunch({ url: '/pages/index' })
    } else {
      errorMsg.value = result.message || '登录失败，请检查账号密码'
    }
  } catch (e) {
    errorMsg.value = '登录异常: ' + (e.message || '未知错误')
  } finally {
    loading.value = false
  }
}

// 微信小程序一键登录
async function handleWxLogin() {
  errorMsg.value = ''
  // #ifndef H5
  if (!server.value.trim()) { errorMsg.value = '请先输入服务器地址'; return }
  formatServer()
  store.setServer(server.value)
  // #endif
  loading.value = true
  try {
    const result = await wxLogin(store.state.server)
    if (result.success) {
      store.setUsername(result.data.username || '')
      store.setLoginStatus(true)
      uni.reLaunch({ url: '/pages/index' })
    } else {
      errorMsg.value = result.message || '微信登录失败'
    }
  } catch (e) {
    errorMsg.value = '微信登录异常: ' + (e.message || '未知错误')
  } finally {
    loading.value = false
  }
}

// 企微 / 钉钉 OAuth 登录（H5 + App）
async function handleOAuthLogin(type, label) {
  errorMsg.value = ''
  // #ifndef H5
  if (!server.value.trim()) { errorMsg.value = '请先输入服务器地址'; return }
  formatServer()
  store.setServer(server.value)
  // #endif
  loading.value = true
  try {
    const result = await oauthLogin(store.state.server, type)
    if (!result.success) {
      errorMsg.value = result.message || `${label}登录失败`
    } else {
      // #ifndef H5
      uni.navigateTo({ url: '/pages/webview-oauth' })
      // #endif
    }
  } catch (e) {
    errorMsg.value = `${label}登录异常: ` + (e.message || '未知错误')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #f5f6fa 60%, #f5f6fa 100%);
  background-color: #0f3460;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 40rpx 40rpx;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom, 0px));
  position: relative;
  overflow-x: hidden;
}

/* === 装饰背景 === */
.bg-decoration { position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; }
.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(26, 115, 232, 0.08);
}
.bg-circle-1 {
  width: 500rpx; height: 500rpx;
  top: -120rpx; right: -160rpx;
  animation: floatUp 8s ease-in-out infinite;
}
.bg-circle-2 {
  width: 300rpx; height: 300rpx;
  top: 40%; left: -100rpx;
  animation: floatUp 10s ease-in-out infinite reverse;
}
.bg-circle-3 {
  width: 200rpx; height: 200rpx;
  top: 60%; right: -60rpx;
  background: rgba(88, 86, 214, 0.06);
  animation: floatUp 7s ease-in-out infinite;
}
@keyframes floatUp {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30rpx) scale(1.05); }
}

/* === Logo === */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
  z-index: 1;
}
.logo-icon {
  width: 400rpx; height: 148rpx;
  margin-bottom: 16rpx;
}
.app-desc {
  font-size: 24rpx;
  color: rgba(255,255,255,0.55);
  margin-top: 12rpx;
  letter-spacing: 4rpx;
}

/* === 表单 === */
.form-section {
  width: 100%;
  max-width: 650rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 44rpx 36rpx 36rpx;
  box-shadow: 0 16rpx 48rpx rgba(0,0,0,0.08);
  z-index: 1;
}

.input-group { margin-bottom: 24rpx; }
.input-label {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: #555;
  margin-bottom: 10rpx;
  letter-spacing: 1rpx;
}
.input-wrap {
  display: flex;
  align-items: center;
  background: #f5f6fa;
  border: 2rpx solid transparent;
  border-radius: 14rpx;
  padding: 0 20rpx;
  height: 92rpx;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.input-wrap-sm { height: 80rpx; }
.input-prefix { font-size: 30rpx; margin-right: 16rpx; flex-shrink: 0; }
.input-field {
  flex: 1;
  font-size: 30rpx;
  color: #1a1a2e;
  background: transparent;
  height: 100%;
  border: none;
  outline: none;
  -webkit-appearance: none;
}
/* placeholder 样式通过 placeholder-style 属性设置，不使用 ::placeholder */
.pwd-toggle {
  font-size: 30rpx;
  padding: 8rpx;
  flex-shrink: 0;
  opacity: 0.6;
}
.pwd-toggle:active { opacity: 1; }

/* === 记住密码 === */
.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6rpx 0 16rpx;
}
.remember-check { display: flex; align-items: center; gap: 10rpx; }
.check-box {
  width: 36rpx; height: 36rpx;
  border: 2rpx solid #c7c7cc;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  color: #fff;
  transition: all 0.15s;
}
.check-box.checked {
  background: #1a73e8;
  border-color: #1a73e8;
}
.remember-label { font-size: 26rpx; color: #555; }

/* === 服务器历史 === */
.history-toggle {
  font-size: 22rpx;
  color: #c7c7cc;
  padding: 8rpx;
  flex-shrink: 0;
}
.server-history {
  background: #fff;
  border: 1rpx solid #e8e8ed;
  border-radius: 12rpx;
  margin-top: 8rpx;
  max-height: 320rpx;
  overflow-y: auto;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
}
.history-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 18rpx 20rpx;
  border-bottom: 1rpx solid #f5f6fa;
}
.history-item:last-child { border-bottom: none; }
.history-item:active { background: #f0f4ff; }
.history-item.active { background: #f0f4ff; }
.history-icon { font-size: 24rpx; flex-shrink: 0; }
.history-url {
  font-size: 24rpx;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* === 高级选项 === */
.advanced-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  margin-bottom: 8rpx;
}
.advanced-label { font-size: 26rpx; color: #8e8e93; }
.arrow {
  font-size: 36rpx;
  color: #c7c7cc;
  transition: transform 0.15s ease;
  display: inline-block;
}
.arrow.rotated { transform: rotate(90deg); }

.advanced-section {
  margin-bottom: 16rpx;
}

/* === 按钮 === */
.btn-login {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #1a73e8 0%, #5856d6 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 700;
  border: none;
  border-radius: 16rpx;
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(26, 115, 232, 0.3);
}
.btn-login:active {
  box-shadow: 0 4rpx 12rpx rgba(26, 115, 232, 0.2);
}
.btn-login.loading { opacity: 0.8; }

.btn-loading-spinner {
  display: inline-block;
  width: 28rpx; height: 28rpx;
  border: 3rpx solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* === 错误消息 === */
.error-msg {
  margin-top: 20rpx;
  padding: 18rpx 24rpx;
  background: #fff2f0;
  border-left: 6rpx solid #ff3b30;
  border-radius: 10rpx;
  font-size: 26rpx;
  color: #cf1322;
  display: flex;
  align-items: flex-start;
  animation: slideIn 0.3s ease;
}
.error-icon-inline { flex-shrink: 0; font-size: 26rpx; margin-top: 2rpx; }
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10rpx); }
  to { opacity: 1; transform: translateY(0); }
}

/* === 第三方快捷登录 === */
.social-login-section {
  margin-top: 28rpx;
}
.divider {
  display: flex;
  align-items: center;
  margin-bottom: 28rpx;
}
.divider-line {
  flex: 1;
  height: 1rpx;
  background: #e8e8ed;
}
.divider-text {
  font-size: 22rpx;
  color: #bcbcc2;
  padding: 0 20rpx;
  letter-spacing: 2rpx;
}
.social-login-row {
  display: flex;
  justify-content: center;
  gap: 56rpx;
}
.social-btn-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}
.social-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}
.social-btn:active {
  opacity: 0.75;
  transform: scale(0.92);
}
.social-btn-wx { background: #07c160; }
.social-btn-qw { background: #2f7be5; }
.social-btn-dd { background: #3370ff; }
.social-btn-img {
  width: 42rpx;
  height: 42rpx;
}
.social-btn-label {
  font-size: 20rpx;
  color: #9a9aa0;
  letter-spacing: 1rpx;
}

/* === 底部 === */
.footer-tip {
  margin-top: 30rpx;
  font-size: 22rpx;
  color: #8e8e93;
  text-align: center;
  z-index: 1;
}

/* #ifdef H5 */
/* H5 模式内容较少，加深底部背景避免白底 */
.login-page {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 45%, #0f3460 85%, #1a2744 100%);
  background-color: #1a2744;
}
/* #endif */
</style>
