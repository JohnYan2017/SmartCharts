<template>
  <!-- #ifdef MP-WEIXIN -->
  <!-- 小程序：服务器配置页 -->
  <view class="mp-config-page">
    <view class="mp-config-card">
      <image class="mp-config-logo" src="/static/logo.png" mode="aspectFit" />
      <text class="mp-config-title">SmartChart</text>
      <text class="mp-config-desc">请输入服务器地址以继续</text>
      <view class="mp-config-input-wrap">
        <input
          class="mp-config-input"
          v-model="mpServerInput"
          placeholder="https://smartchart.cn/m/"
          placeholder-style="color:#c7c7cc"
          type="text"
          confirm-type="go"
          @confirm="handleSetServer"
        />
      </view>
      <view v-if="serverHistory.length" class="mp-config-history">
        <view
          v-for="(h, hi) in serverHistory"
          :key="hi"
          class="mp-config-history-item"
          @tap="mpServerInput = h"
        >
          <text class="mp-config-history-icon">🕐</text>
          <text class="mp-config-history-url">{{ h }}</text>
        </view>
      </view>
      <button class="mp-config-btn" @tap="handleSetServer">继续</button>
      <button v-if="store.state.server" class="mp-config-btn mp-config-btn-enter" @tap="handleEnter">进入应用</button>
    </view>
  </view>
  <!-- #endif -->

  <!-- #ifndef MP-WEIXIN -->
  <!-- H5 + App：原生 Dashboard -->
  <view class="home-page">
    <!-- 断网横幅 -->
    <view v-if="isOffline" class="offline-banner">
      <text class="offline-icon">📡</text>
      <text class="offline-text">当前无网络连接，请检查网络设置</text>
    </view>

    <!-- 头部 -->
    <view class="header">
      <view class="header-left">
        <view class="avatar">{{ username.charAt(0).toUpperCase() }}</view>
        <view class="header-info">
          <text class="greeting">{{ greeting }}, {{ username }}</text>
          <text class="server-tag">{{ serverHost }}</text>
        </view>
      </view>
      <view class="header-right">
        <text class="logout-btn" @click="handleLogout">退出</text>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar-wrap">
      <view class="search-bar">
        <view class="search-input-wrap">
          <text class="search-icon">🔍</text>
          <input
            class="search-input"
            v-model="searchKeyword"
            placeholder="搜索报表名称..."
            placeholder-style="color:#c7c7cc"
            confirm-type="search"
          />
          <text v-if="searchKeyword" class="search-clear" @click="searchKeyword=''">✕</text>
        </view>
        <view v-if="groups.length && !searchKeyword" class="collapse-btn" @click="toggleAll">
          <text class="collapse-text">{{ allExpanded ? '收起' : '展开' }}</text>
          <text class="collapse-chevron" :class="{ rotated: allExpanded }">›</text>
        </view>
        <text class="refresh-btn" @click="onRefresh">🔄</text>
      </view>
    </view>

    <!-- 骨架屏加载 -->
    <view v-if="loading && groups.length === 0" class="skeleton-wrap">
      <view v-for="i in 3" :key="i" class="skeleton-section">
        <view class="skeleton-header"></view>
        <view v-for="j in 2" :key="j" class="skeleton-card">
          <view class="skeleton-icon"></view>
          <view class="skeleton-lines">
            <view class="skeleton-line w-60"></view>
            <view class="skeleton-line w-40"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else-if="!loading && !loadError && displayGroups.length === 0" class="empty-wrap">
      <text class="empty-icon">📊</text>
      <text class="empty-text">{{ searchKeyword ? '没有匹配的报表' : '暂无报表' }}</text>
      <text class="empty-hint">{{ searchKeyword ? '尝试其他关键词' : '请在 SmartChart 后台创建报表' }}</text>
    </view>

    <!-- 加载失败状态 -->
    <view v-else-if="!loading && loadError" class="empty-wrap">
      <text class="empty-icon">😵</text>
      <text class="empty-text">加载失败</text>
      <text class="empty-hint">{{ loadErrorMsg }}</text>
      <view class="retry-btn-wrap">
        <button class="retry-btn" @click="fetchList">
          <text>🔄 重新加载</text>
        </button>
      </view>
    </view>

    <!-- 列表 -->
    <scroll-view
      v-else
      class="dashboard-list"
      :style="{ height: scrollH + 'px' }"
      scroll-y
      :refresher-enabled="enableRefresh"
      :refresher-triggered="refreshing"
      refresher-threshold="80"
      @refresherrefresh="handleRefresh"
      @scrolltoupper="onScrollToTop"
      @scroll="onScroll"
    >
      <!-- 最近访问 -->
      <view v-if="recentVisits.length && !searchKeyword" class="recent-section">
        <view class="recent-header">
          <text class="recent-title">🕐 最近访问</text>
          <text class="recent-clear" @click="clearRecent">清除</text>
        </view>
        <scroll-view scroll-x class="recent-scroll">
          <view class="recent-list">
            <view
              v-for="(item, ri) in recentVisits"
              :key="ri"
              class="recent-card"
              @click="openRecent(item)"
            >
              <view class="recent-icon" :style="{ background: item.color || 'linear-gradient(135deg, #1a73e8, #5856d6)' }">
                <!-- #ifdef H5 -->
                <i v-if="isFaClass(item.icon)" :class="item.icon" class="card-fa-icon"></i>
                <text v-else-if="item.icon" class="recent-emoji">{{ item.icon }}</text>
                <!-- #endif -->
                <!-- #ifndef H5 -->
                <text v-if="faIconToEmoji(item.icon)" class="recent-emoji">{{ faIconToEmoji(item.icon) }}</text>
                <!-- #endif -->
              </view>
              <text class="recent-name">{{ item.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view v-for="(group, gi) in displayGroups" :key="gi" class="project-section">
        <!-- 项目头 -->
        <view class="section-header" @click="!searchKeyword && toggleSection(gi)">
          <view class="section-left">
            <view class="section-icon-wrap">
              <!-- #ifdef H5 -->
              <i v-if="isFaClass(group.projectIcon)" :class="group.projectIcon" class="section-fa-icon"></i>
              <text v-else-if="group.projectIcon" class="section-emoji">{{ group.projectIcon }}</text>
              <!-- #endif -->
              <!-- #ifndef H5 -->
              <text v-if="faIconToEmoji(group.projectIcon)" class="section-emoji">{{ faIconToEmoji(group.projectIcon) }}</text>
              <!-- #endif -->
            </view>
            <text class="section-title">{{ group.projectName }}</text>
          </view>
          <view class="section-right">
            <text class="section-count">{{ group._count }}</text>
            <text v-if="!searchKeyword" class="section-chevron" :class="{ rotated: !group._collapsed }">›</text>
          </view>
        </view>

        <!-- 模型列表 -->
        <view v-if="searchKeyword || !group._collapsed" class="section-body">
          <view v-for="(model, mi) in group.models" :key="mi">
            <view
              class="dash-card"
              :class="{ 'has-children': model.children.length, expanded: model.children.length && (searchKeyword || !model._collapsed) }"
              @click="model.children.length ? (!searchKeyword && toggleModel(gi, mi)) : openModel(model, group)"
            >
              <view class="card-main">
                <view class="card-icon" :style="{ background: model.color || 'linear-gradient(135deg, #1a73e8, #5856d6)' }">
                  <!-- #ifdef H5 -->
                  <i v-if="isFaClass(model.icon)" :class="model.icon" class="card-fa-icon"></i>
                  <text v-else-if="model.icon" class="card-emoji">{{ model.icon }}</text>
                  <!-- #endif -->
                  <!-- #ifndef H5 -->
                  <text v-if="faIconToEmoji(model.icon)" class="card-emoji">{{ faIconToEmoji(model.icon) }}</text>
                  <!-- #endif -->
                </view>
                <view class="card-info">
                  <text class="card-title">{{ model.name }}</text>
                </view>
                <view class="card-right">
                  <text v-if="model.children.length" class="card-badge">{{ model.children.length }}</text>
                  <text v-if="!searchKeyword && model.children.length" class="card-chevron" :class="{ rotated: !model._collapsed }">›</text>
                </view>
              </view>
            </view>

            <!-- 子模型（支持无限层级递归） -->
            <view v-if="searchKeyword || model._collapsed === false" class="sub-models">
              <SubNodes
                :nodes="model.children"
                :depth="1"
                :icon-fn="faIconToEmoji"
                :on-open="(child) => openModel(child, group)"
                :path="[mi]"
                @toggle="(e) => toggleByPath(gi, e.path)"
              />
            </view>
          </view>
        </view>
      </view>

      <view v-if="totalModelCount > 0" class="list-footer">
        <text v-if="lastUpdateTime">最后更新: {{ lastUpdateTime }}  ·  </text>
        <text>— 共 {{ totalModelCount }} 个模块 —</text>
      </view>
    </scroll-view>
  </view>
  <!-- #endif -->
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { onUnload } from '@dcloudio/uni-app'
import store from '@/store/index.js'

// #ifdef MP-WEIXIN
// 小程序：配置页 → 跳转独立 web-view 页面
const mpServerInput = ref(store.state.server || '')
const serverHistory = computed(() => store.state.serverHistory || [])

function goWebView(url) {
  uni.redirectTo({ url: '/pages/webview-h5?url=' + encodeURIComponent(url) })
}

onMounted(() => {
  const server = store.state.server
  if (server) {
    mpServerInput.value = server
  }
})

function handleSetServer() {
  let url = mpServerInput.value.trim()
  if (!url) return
  if (!url.startsWith('http')) url = 'https://' + url
  url = url.replace(/\/+$/, '')
  store.setServer(url)
  store.addServerHistory(url)
  goWebView(url)
}

function handleEnter() {
  const server = store.state.server
  if (server) {
    goWebView(server)
  }
}
// #endif

// #ifndef MP-WEIXIN
// H5 + App：原生 Dashboard 模式
import { getDashboardList } from '@/api/smartchart.js'
import { faIconToEmoji } from '@/utils/iconMap.js'
import SubNodes from '@/components/SubNodes.vue'

function isFaClass(str) {
  return str && str.includes('fa-')
}

const searchKeyword = ref('')
const loading = ref(false)
const groups = ref([])
const isOffline = ref(false)
const loadError = ref(false)
const loadErrorMsg = ref('')
const lastUpdateTime = ref('')
const displayGroups = ref([])
const refreshing = ref(false)
const enableRefresh = ref(true)
const scrollH = ref(0)
const recentVisits = ref([])
let searchTimer = null
let pageAlive = true
let isAtTop = true
let allExpanded = ref(false)

const username = computed(() => store.state.username || '用户')
const serverHost = computed(() => (store.state.server || '').replace(/^https?:\/\//, ''))
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '🌜 夜深了'
  if (h < 12) return '☀️ 上午好'
  if (h < 14) return '🌞 中午好'
  if (h < 18) return '🌤 下午好'
  return '🌙 晚上好'
})
const totalModelCount = computed(() => {
  return groups.value.reduce((sum, g) => sum + g._count, 0)
})

watch(searchKeyword, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    updateDisplayGroups()
  }, 200)
})

onMounted(() => {
  if (!store.state.isLoggedIn || !store.state.server) {
    uni.reLaunch({ url: '/pages/login' })
    return
  }
  // 计算 scroll-view 可用高度：屏幕高度 - 头部 - 搜索栏
  calcScrollHeight()
  // 加载最近访问
  recentVisits.value = store.getRecentVisits()
  // session 有效性由 fetchList 的 401/403 响应触发全局 onAuthExpired 处理
  fetchList()
  uni.onNetworkStatusChange((res) => {
    isOffline.value = !res.isConnected
    if (res.isConnected && loadError.value) {
      fetchList()
    }
  })
  uni.getNetworkType({
    success: (res) => { isOffline.value = res.networkType === 'none' }
  })
})

onUnload(() => {
  pageAlive = false
  if (searchTimer) clearTimeout(searchTimer)
})

async function fetchList() {
  if (loading.value) return
  loading.value = true
  loadError.value = false
  try {
    const result = await getDashboardList(store.state.server, 'mobile')
    if (!pageAlive) return  // 页面已卸载，放弃更新
    if (result.success && result.data) {
      const rawData = result.data.data || result.data || []
      groups.value = formatList(rawData)
      store.setDashboardList(groups.value)
      updateDisplayGroups()
      const now = new Date()
      lastUpdateTime.value = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
    } else {
      loadError.value = true
      loadErrorMsg.value = result.message || '服务返回异常，请稍后重试'
    }
  } catch (e) {
    if (e.message && e.message.includes('登录已过期')) return
    loadError.value = true
    loadErrorMsg.value = isOffline.value ? '当前无网络连接' : '网络异常，请检查后重试'
  } finally {
    loading.value = false
  }
}

function formatList(rawData) {
  const arr = Array.isArray(rawData) ? rawData : (rawData.data || [])
  return arr.map(project => {
    const models = processModels(project.models || [])
    return {
      projectName: project.name || '',
      projectIcon: project.icon || '',
      projectEid: project.eid || '',
      _collapsed: false,
      _count: countAll(models),
      models
    }
  }).filter(g => g.models.length > 0)
}

function processModels(models) {
  return (models || [])
    .map(m => ({
      name: m.name || '',
      url: m.url || '',
      eid: m.eid || '',
      icon: m.icon || '',
      color: m.color || '',
      _collapsed: true,
      children: m.models ? processModels(m.models) : []
    }))
}

function filterModels(models, kw, projectName) {
  return models.reduce((acc, m) => {
    const nameMatch = m.name.toLowerCase().includes(kw) || projectName.toLowerCase().includes(kw)
    const filteredChildren = m.children.length ? filterModels(m.children, kw, projectName) : []
    if (nameMatch || filteredChildren.length) {
      acc.push({ ...m, children: nameMatch ? m.children : filteredChildren, _collapsed: !nameMatch })
    }
    return acc
  }, [])
}

function countAll(models) {
  let count = 0
  const walk = (items) => { items.forEach(m => { count++; if (m.children.length) walk(m.children) }) }
  walk(models)
  return count
}

function toggleSection(gi) {
  const arr = displayGroups.value.slice()
  arr[gi] = Object.assign({}, arr[gi], { _collapsed: !arr[gi]._collapsed })
  displayGroups.value = arr
}

function toggleModel(gi, mi) {
  toggleByPath(gi, [mi])
}

// 按路径切换任意深度节点的展开/收起
function toggleByPath(gi, path) {
  const arr = displayGroups.value.slice()
  const group = Object.assign({}, arr[gi])
  let models = group.models.slice()
  let node = models[path[0]]
  for (let i = 1; i < path.length; i++) {
    node.children = node.children.slice()
    node = Object.assign({}, node.children[path[i]])
    node.children = node.children ? node.children.slice() : []
  }
  node = Object.assign({}, node, { _collapsed: !node._collapsed })
  // 重新组装
  let target = models[path[0]]
  if (path.length === 1) {
    models[path[0]] = node
  } else {
    for (let i = 1; i < path.length; i++) {
      const children = target.children.slice()
      children[path[i]] = node
      target = Object.assign({}, target, { children })
      if (i < path.length - 1) {
        node = children[path[i]]
      }
    }
    models[path[0]] = target
  }
  group.models = models
  arr[gi] = group
  displayGroups.value = arr
}

function updateDisplayGroups() {
  if (!searchKeyword.value) {
    displayGroups.value = groups.value
  } else {
    const kw = searchKeyword.value.toLowerCase()
    displayGroups.value = groups.value.map(g => {
      const filtered = filterModels(g.models, kw, g.projectName)
      if (filtered.length === 0) return null
      return { ...g, models: filtered }
    }).filter(Boolean)
  }
}

function openModel(model, group) {
  // 构造报表完整 URL：优先用 url，否则用 eid 拼出 Django 报表路径
  let reportUrl = model.url || ''
  if (!reportUrl && model.eid) {
    const eidStr = String(model.eid)
    const chartId = eidStr.startsWith('e') ? eidStr.slice(1) : eidStr
    reportUrl = store.state.server + '/echart/?type=' + chartId
  }
  // 记录最近访问（只存 eid，不存带 st 的 url）
  recentVisits.value = store.addRecentVisit({
    name: model.name,
    eid: model.eid || '',
    icon: model.icon || '',
    color: model.color || '',
    project: group.projectName
  })
  const params = [
    'name=' + encodeURIComponent(model.name),
    'url=' + encodeURIComponent(reportUrl),
    'eid=' + encodeURIComponent(model.eid || ''),
    'project=' + encodeURIComponent(group.projectName)
  ].join('&')
  uni.navigateTo({ url: '/pages/report?' + params })
}

// 从最近访问卡片打开报表（动态用当前服务器拼 URL）
function openRecent(item) {
  const eidStr = String(item.eid || '')
  const chartId = eidStr.startsWith('e') ? eidStr.slice(1) : eidStr
  const reportUrl = store.state.server + '/echart/?type=' + chartId
  const params = [
    'name=' + encodeURIComponent(item.name),
    'url=' + encodeURIComponent(reportUrl),
    'eid=' + encodeURIComponent(item.eid || ''),
    'project=' + encodeURIComponent(item.project || '')
  ].join('&')
  uni.navigateTo({ url: '/pages/report?' + params })
}

function clearRecent() {
  store.clearRecentVisits()
  recentVisits.value = []
}

// 展开/收起全部（递归处理所有层级）
function toggleAll() {
  const expand = !allExpanded.value
  allExpanded.value = expand
  function setCollapsed(nodes) {
    return nodes.map(m => ({
      ...m,
      _collapsed: !expand,
      children: m.children ? setCollapsed(m.children) : []
    }))
  }
  displayGroups.value = displayGroups.value.map(g => ({
    ...g,
    _collapsed: !expand,
    models: setCollapsed(g.models)
  }))
}

async function onRefresh() {
  if (loading.value) return
  uni.showLoading({ title: '刷新中...' })
  await fetchList()
  uni.hideLoading()
}

// scroll-view 滚动事件：离开顶部时禁用下拉刷新
function onScroll(e) {
  const top = e.detail.scrollTop
  isAtTop = top <= 5
  if (!isAtTop && enableRefresh.value) {
    enableRefresh.value = false
  }
}
// 滚动回到顶部时重新启用下拉刷新
function onScrollToTop() {
  isAtTop = true
  enableRefresh.value = true
}

// scroll-view 下拉刷新（守卫：非顶部直接拒绝）
async function handleRefresh() {
  if (!isAtTop) {
    refreshing.value = false
    return
  }
  refreshing.value = true
  await fetchList()
  refreshing.value = false
}

function handleLogout() {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号吗？',
    success: (res) => {
      if (res.confirm) { store.logout(); uni.reLaunch({ url: '/pages/login' }) }
    }
  })
}

// 动态计算 scroll-view 高度（App 端 scroll-view 必须显式指定高度）
function calcScrollHeight() {
  const sysInfo = uni.getSystemInfoSync()
  const query = uni.createSelectorQuery()
  query.select('.header').boundingClientRect()
  query.select('.search-bar-wrap').boundingClientRect()
  query.exec((res) => {
    if (!res || !res[0] || !res[1]) {
      // fallback：用估算值
      scrollH.value = sysInfo.windowHeight - 200
      return
    }
    const headerH = res[0].height
    const searchH = res[1].height
    scrollH.value = sysInfo.windowHeight - headerH - searchH
  })
}
// #endif
</script>

<style scoped>
.home-page { min-height: 100vh; background: #f5f6fa; display: flex; flex-direction: column; }

/* === 断网横幅 === */
.offline-banner {
  background: #ff3b30;
  padding: 14rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}
.offline-icon { font-size: 24rpx; }
.offline-text { font-size: 24rpx; color: #fff; font-weight: 500; }

/* === 头部 === */
.header {
  background: linear-gradient(135deg, #1a1a2e 0%, #1a73e8 40%, #5856d6 100%);
  padding: 20rpx 32rpx;
  padding-top: calc(20rpx + var(--status-bar-height, 44px));
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left { display: flex; align-items: center; gap: 16rpx; }
.avatar {
  width: 72rpx; height: 72rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.header-info { display: flex; flex-direction: column; }
.greeting { font-size: 32rpx; font-weight: 700; color: #fff; }
.server-tag {
  font-size: 22rpx;
  color: rgba(255,255,255,0.6);
  margin-top: 4rpx;
  max-width: 360rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.header-right { flex-shrink: 0; display: flex; align-items: center; gap: 16rpx; }
.logout-btn {
  font-size: 26rpx;
  color: rgba(255,255,255,0.8);
  background: rgba(255,255,255,0.15);
  padding: 10rpx 24rpx;
  border-radius: 20rpx;
}

/* === 搜索栏 === */
.search-bar-wrap {
  background: #fff;
  padding: 16rpx 24rpx 20rpx;
  border-radius: 0 0 24rpx 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}
.search-bar { display: flex; align-items: center; gap: 16rpx; }
.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f5f6fa;
  border-radius: 28rpx;
  padding: 0 20rpx;
  height: 72rpx;
  transition: all 0.25s;
  border: 2rpx solid transparent;
}
.search-input-wrap:focus-within {
  background: #fff;
  border-color: #1a73e8;
  box-shadow: 0 0 0 6rpx rgba(26, 115, 232, 0.06);
}
.search-icon { font-size: 28rpx; margin-right: 12rpx; }
.search-input { flex: 1; font-size: 28rpx; color: #1a1a2e; background: transparent; }
.search-clear {
  font-size: 24rpx;
  color: #c7c7cc;
  width: 36rpx; height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e8e8ed;
}
.collapse-btn {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 8rpx 20rpx;
  background: linear-gradient(135deg, #f0f4ff, #e8f0fe);
  border-radius: 20rpx;
  flex-shrink: 0;
  transition: all 0.2s;
}
.collapse-btn:active { opacity: 0.7; transform: scale(0.95); }
.collapse-text {
  font-size: 24rpx;
  color: #1a73e8;
  font-weight: 600;
  white-space: nowrap;
}
.collapse-chevron {
  font-size: 24rpx;
  color: #1a73e8;
  transition: transform 0.25s;
  display: inline-block;
  transform: rotate(90deg);
}
.collapse-chevron.rotated {
  transform: rotate(-90deg);
}
.refresh-btn {
  font-size: 32rpx;
  padding: 6rpx;
  flex-shrink: 0;
}

/* === 骨架屏 === */
.skeleton-wrap { flex: 1; padding: 16rpx 24rpx; }
.skeleton-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 24rpx;
}
.skeleton-header {
  height: 40rpx;
  width: 60%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}
.skeleton-card {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  gap: 16rpx;
}
.skeleton-icon {
  width: 72rpx; height: 72rpx;
  border-radius: 14rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}
.skeleton-lines { flex: 1; display: flex; flex-direction: column; gap: 10rpx; }
.skeleton-line {
  height: 22rpx;
  border-radius: 6rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.w-60 { width: 60%; }
.w-40 { width: 40%; }
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* === 空状态 === */
.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 240rpx;
  flex: 1;
}
.empty-icon { font-size: 100rpx; margin-bottom: 24rpx; }
.empty-text { font-size: 30rpx; color: #8e8e93; font-weight: 500; }
.empty-hint { font-size: 24rpx; color: #c7c7cc; margin-top: 10rpx; }

/* === 重试按钮 === */
.retry-btn-wrap { margin-top: 32rpx; }
.retry-btn {
  height: 80rpx;
  padding: 0 48rpx;
  background: linear-gradient(135deg, #1a73e8, #5856d6);
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(26, 115, 232, 0.25);
}
.retry-btn:active { opacity: 0.85; transform: scale(0.98); }

/* === 列表 === */
.dashboard-list { flex: 1; }
.dashboard-list > view { padding: 0 24rpx; }
.dashboard-list > view:first-child { padding-top: 16rpx; }

/* === 最近访问 === */
.recent-section {
  padding-bottom: 12rpx;
}
.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24rpx;
  margin-bottom: 12rpx;
}
.recent-title { font-size: 26rpx; font-weight: 600; color: #555; }
.recent-clear { font-size: 22rpx; color: #1a73e8; }
.recent-clear:active { opacity: 0.6; }
.recent-scroll { white-space: nowrap; }
.recent-list { display: flex; gap: 16rpx; padding: 0 24rpx 8rpx; }
.recent-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  width: 120rpx;
  flex-shrink: 0;
}
.recent-card:active { opacity: 0.7; }
.recent-icon {
  width: 72rpx; height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}
.recent-emoji { font-size: 28rpx; line-height: 1; }
.recent-icon .card-fa-icon { font-size: 28rpx; color: #fff; }
.recent-name {
  font-size: 22rpx;
  color: #555;
  max-width: 120rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

/* === 项目分区 === */
.project-section {
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  cursor: pointer;
}
.section-left { display: flex; align-items: center; flex: 1; min-width: 0; }
.section-icon-wrap {
  width: 48rpx; height: 48rpx;
  border-radius: 14rpx;
  background: linear-gradient(135deg, #f0f4ff, #e8f0fe);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}
.section-emoji { font-size: 24rpx; line-height: 1; }
.section-icon-wrap .section-fa-icon { font-size: 22rpx; color: #1a73e8; }
.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.section-right { display: flex; align-items: center; gap: 10rpx; flex-shrink: 0; }
.section-count {
  font-size: 22rpx;
  color: #8e8e93;
  background: #f5f6fa;
  padding: 4rpx 16rpx;
  border-radius: 12rpx;
}
.section-chevron {
  font-size: 36rpx;
  color: #c7c7cc;
  transition: transform 0.15s ease;
  display: inline-block;
  width: 36rpx;
  text-align: center;
}
.section-chevron.rotated { transform: rotate(90deg); }

/* 折叠 - section body */
.section-body {
  padding: 4rpx 20rpx 20rpx;
}

/* === 模型卡片 === */
.dash-card {
  border-radius: 14rpx;
  margin-bottom: 10rpx;
  padding: 16rpx 20rpx;
  background: #fafbfc;
  border: 1rpx solid #f0f0f0;
  cursor: pointer;
}
.dash-card:active { background: #f0f4ff; }
.dash-card.expanded {
  background: #f5f7fb;
  border-color: #e0e8f5;
  border-radius: 14rpx 14rpx 6rpx 6rpx;
}
.card-main { display: flex; align-items: center; }
.card-icon {
  width: 72rpx; height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}
.card-emoji { font-size: 30rpx; line-height: 1; }
.card-icon .card-fa-icon { font-size: 28rpx; color: #fff; }
.card-icon.small-icon {
  width: 56rpx; height: 56rpx;
  border-radius: 12rpx;
}
.small-emoji { font-size: 24rpx; }
.card-info { flex: 1; min-width: 0; }
.card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a2e;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-right {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex-shrink: 0;
  margin-left: 8rpx;
}
.card-badge {
  font-size: 20rpx;
  color: #fff;
  background: #1a73e8;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
  font-weight: 600;
}
.card-chevron {
  font-size: 32rpx;
  color: #8e8e93;
  transition: transform 0.15s ease;
  display: inline-block;
  width: 32rpx;
  text-align: center;
}
.card-chevron.rotated { transform: rotate(90deg); }
.card-arrow { font-size: 32rpx; color: #c7c7cc; }

/* === 子模型 === */
.sub-models {
  margin-left: 28rpx;
  padding-left: 20rpx;
  border-left: 2rpx solid #e8e8ed;
  margin-bottom: 6rpx;
}
.sub-card { margin-bottom: 6rpx; }

/* === 底部 === */
.list-footer {
  text-align: center;
  padding: 32rpx 0 80rpx;
  font-size: 24rpx;
  color: #c7c7cc;
  letter-spacing: 2rpx;
}

/* === 小程序配置页 === */
/* #ifdef MP-WEIXIN */
.mp-config-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 0 40rpx;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}
.mp-config-card {
  width: 100%; max-width: 620rpx;
  background: #fff; border-radius: 24rpx;
  padding: 48rpx 36rpx 40rpx;
  box-shadow: 0 16rpx 48rpx rgba(0,0,0,0.15);
  display: flex; flex-direction: column; align-items: center;
}
.mp-config-logo { width: 320rpx; height: 120rpx; margin-bottom: 16rpx; }
.mp-config-title { font-size: 36rpx; font-weight: 700; color: #1a1a2e; margin-bottom: 8rpx; }
.mp-config-desc { font-size: 24rpx; color: #8e8e93; margin-bottom: 32rpx; }
.mp-config-input-wrap { width: 100%; margin-bottom: 16rpx; }
.mp-config-input {
  width: 100%; height: 88rpx;
  background: #f5f6fa; border-radius: 14rpx;
  padding: 0 24rpx; font-size: 28rpx; color: #1a1a2e;
}
.mp-config-history {
  width: 100%; max-height: 240rpx; overflow-y: auto;
  margin-bottom: 16rpx;
}
.mp-config-history-item {
  display: flex; align-items: center; gap: 10rpx;
  padding: 14rpx 16rpx; border-radius: 10rpx;
}
.mp-config-history-item:active { background: #f0f4ff; }
.mp-config-history-icon { font-size: 22rpx; flex-shrink: 0; }
.mp-config-history-url {
  font-size: 24rpx; color: #555;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.mp-config-btn {
  width: 100%; height: 88rpx;
  background: linear-gradient(135deg, #1a73e8, #5856d6);
  color: #fff; font-size: 30rpx; font-weight: 600;
  border: none; border-radius: 16rpx;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(26,115,232,0.3);
}
.mp-config-btn-enter {
  margin-top: 16rpx;
  background: #fff; color: #1a73e8;
  border: 2rpx solid #1a73e8;
  box-shadow: none;
}
/* #endif */
</style>
