<template>
  <view class="config-page">
    <!-- 装饰背景 -->
    <view class="bg-decoration">
      <view class="bg-circle bg-circle-1"></view>
      <view class="bg-circle bg-circle-2"></view>
    </view>

    <!-- Logo -->
    <view class="logo-section">
      <image class="logo-icon" src="/static/logo.png" mode="aspectFit" />
      <text class="app-desc">数据驱动决策 · 移动端数据看板</text>
    </view>

    <!-- 配置卡片 -->
    <view class="form-section">
      <text class="form-title">服务器配置</text>
      <text class="form-desc">请输入完整的 H5 页面地址，小程序将通过该 URL 加载数据报表</text>

      <view class="input-group">
        <text class="input-label">服务器地址</text>
        <view class="input-wrap" :class="{ focused: inputFocused }">
          <text class="input-prefix">🔗</text>
          <input
            class="input-field"
            v-model="server"
            placeholder="https://smartchart.cn/"
            placeholder-style="color:#c7c7cc"
            type="text"
            @focus="inputFocused = true"
            @blur="onBlur"
          />
        </view>
      </view>

      <!-- 历史记录 -->
      <view v-if="serverHistory.length" class="history-section">
        <text class="history-title">最近使用</text>
        <view class="history-list">
          <view
            v-for="(h, i) in serverHistory"
            :key="i"
            class="history-item"
            :class="{ active: h === server }"
            @click="selectHistory(h)"
          >
            <text class="history-icon">🕐</text>
            <text class="history-url">{{ h }}</text>
          </view>
        </view>
      </view>

      <!-- 错误提示 -->
      <view v-if="errorMsg" class="error-msg">
        <text class="error-icon">⚠️</text>
        <text>{{ errorMsg }}</text>
      </view>

      <!-- 确认按钮 -->
      <button class="btn-confirm" @click="saveAndGo">
        <text>确认并进入</text>
      </button>
    </view>

    <!-- 底部提示 -->
    <view class="footer-tip">
      <text>请确保服务器地址可正常访问</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store/index.js'

const server = ref(store.state.server || '')
const inputFocused = ref(false)
const errorMsg = ref('')

const serverHistory = computed(() => store.state.serverHistory || [])

function selectHistory(h) {
  server.value = h
}

function formatUrl(url) {
  url = url.trim()
  if (url && !url.startsWith('http')) {
    url = 'https://' + url
  }
  return url.replace(/\/+$/, '')
}

function onBlur() {
  inputFocused.value = false
  server.value = formatUrl(server.value)
}

function saveAndGo() {
  errorMsg.value = ''
  const url = formatUrl(server.value)
  if (!url) {
    errorMsg.value = '请输入服务器地址'
    return
  }
  server.value = url
  store.setServer(url)
  store.addServerHistory(url)

  // #ifdef MP-WEIXIN
  // 小程序：返回首页（web-view 壳子）
  uni.reLaunch({ url: '/pages/index' })
  // #endif

  // #ifdef APP-PLUS
  // App：返回首页
  uni.navigateBack({ delta: 1 })
  // #endif
}
</script>

<style scoped>
.config-page {
  min-height: 100%;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #f5f6fa 70%, #f5f6fa 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx 40rpx;
  position: relative;
  overflow-x: hidden;
}

.bg-decoration { position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; }
.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(26, 115, 232, 0.08);
}
.bg-circle-1 { width: 500rpx; height: 500rpx; top: -120rpx; right: -160rpx; }
.bg-circle-2 { width: 300rpx; height: 300rpx; top: 50%; left: -100rpx; }

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48rpx;
  z-index: 1;
}
.logo-icon { width: 400rpx; height: 148rpx; margin-bottom: 16rpx; }
.app-desc {
  font-size: 24rpx;
  color: rgba(255,255,255,0.55);
  margin-top: 12rpx;
  letter-spacing: 4rpx;
}

.form-section {
  width: 100%;
  max-width: 650rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 44rpx 36rpx 36rpx;
  box-shadow: 0 16rpx 48rpx rgba(0,0,0,0.08);
  z-index: 1;
}
.form-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 12rpx;
}
.form-desc {
  display: block;
  font-size: 24rpx;
  color: #8e8e93;
  margin-bottom: 32rpx;
  line-height: 1.6;
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
.input-wrap.focused {
  background: #fff;
  border-color: #1a73e8;
  box-shadow: 0 0 0 6rpx rgba(26, 115, 232, 0.06);
}
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

/* === 历史记录 === */
.history-section { margin-bottom: 24rpx; }
.history-title {
  display: block;
  font-size: 22rpx;
  color: #8e8e93;
  margin-bottom: 12rpx;
}
.history-list {
  background: #f5f6fa;
  border-radius: 12rpx;
  overflow: hidden;
}
.history-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 18rpx 20rpx;
  border-bottom: 1rpx solid #e8e8ed;
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

/* === 错误 === */
.error-msg {
  margin-bottom: 16rpx;
  padding: 18rpx 24rpx;
  background: #fff2f0;
  border-left: 6rpx solid #ff3b30;
  border-radius: 10rpx;
  font-size: 26rpx;
  color: #cf1322;
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.error-icon { flex-shrink: 0; }

/* === 按钮 === */
.btn-confirm {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #1a73e8 0%, #5856d6 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 700;
  border: none;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(26, 115, 232, 0.3);
  margin-top: 8rpx;
}
.btn-confirm:active {
  box-shadow: 0 4rpx 12rpx rgba(26, 115, 232, 0.2);
}

/* === 底部 === */
.footer-tip {
  margin-top: 30rpx;
  font-size: 22rpx;
  color: #8e8e93;
  text-align: center;
  z-index: 1;
}
</style>
