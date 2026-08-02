/**
 * 全局状态管理（Vue 3 reactive 轻量方案）
 */
import { reactive } from 'vue'
import { clearCookieJar } from '@/utils/request.js'

// 简易编码/解码（非加密，仅防止明文存储）
function encode(str) {
  try {
    const buf = new ArrayBuffer(str.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i)
    return uni.arrayBufferToBase64(buf)
  } catch { return '' }
}
function decode(str) {
  try {
    const b64 = uni.base64ToArrayBuffer(str)
    return String.fromCharCode(...new Uint8Array(b64))
  } catch { return '' }
}

const state = reactive({
  server: (() => {
    // #ifdef H5
    // H5 同域部署：自动使用当前域名，无需用户输入
    return window.location.origin
    // #endif
    // #ifndef H5
    // 优先读取用户存储的地址，其次使用打包时注入的默认值
    return uni.getStorageSync('sc_server') || (typeof __DEFAULT_SERVER__ !== 'undefined' ? __DEFAULT_SERVER__ : '')
    // #endif
  })(),
  username: uni.getStorageSync('sc_username') || '',
  isLoggedIn: !!uni.getStorageSync('sc_is_logged_in'),
  dashboardList: [],
  // 服务器历史（最近 5 个）
  serverHistory: uni.getStorageSync('sc_server_history') || [],
  // 记住密码
  rememberPwd: !!uni.getStorageSync('sc_remember_pwd'),
  savedPassword: uni.getStorageSync('sc_saved_pwd') ? decode(uni.getStorageSync('sc_saved_pwd')) : ''
})

export default {
  state,
  setServer(server) {
    state.server = server.replace(/\/+$/, '')
    uni.setStorageSync('sc_server', state.server)
  },
  setUsername(name) {
    state.username = name
    uni.setStorageSync('sc_username', name)
  },
  setLoginStatus(status) {
    state.isLoggedIn = status
    if (status) {
      uni.setStorageSync('sc_is_logged_in', true)
    } else {
      uni.removeStorageSync('sc_is_logged_in')
    }
  },
  setDashboardList(list) {
    state.dashboardList = list || []
  },

  // === 服务器历史 ===
  addServerHistory(server) {
    const s = server.replace(/\/+$/, '')
    if (!s) return
    const list = (state.serverHistory || []).filter(x => x !== s)
    list.unshift(s)
    state.serverHistory = list.slice(0, 5)
    uni.setStorageSync('sc_server_history', state.serverHistory)
  },

  // === 记住密码 ===
  setRememberPwd(on, password) {
    state.rememberPwd = on
    if (on && password) {
      state.savedPassword = password
      uni.setStorageSync('sc_remember_pwd', true)
      uni.setStorageSync('sc_saved_pwd', encode(password))
    } else {
      state.savedPassword = ''
      uni.removeStorageSync('sc_remember_pwd')
      uni.removeStorageSync('sc_saved_pwd')
    }
  },

  // === 最近访问（按服务器隔离，只存 eid 不存 url）===
  _recentKey() {
    // 用 hostname 作为 key，避免同服务器下混用
    try {
      const u = new URL(state.server)
      return 'sc_recent_' + u.hostname
    } catch {
      return 'sc_recent_' + state.server.replace(/[^a-zA-Z0-9.-]/g, '')
    }
  },
  addRecentVisit(item) {
    const key = this._recentKey()
    const list = uni.getStorageSync(key) || []
    // 按 eid 去重
    const eid = item.eid || ''
    const filtered = list.filter(x => x.eid !== eid)
    filtered.unshift({
      eid,
      name: item.name,
      icon: item.icon || '',
      color: item.color || '',
      project: item.project || '',
      time: Date.now()
    })
    const result = filtered.slice(0, 5)
    uni.setStorageSync(key, result)
    return result
  },
  getRecentVisits() {
    const key = this._recentKey()
    return uni.getStorageSync(key) || []
  },
  clearRecentVisits() {
    const key = this._recentKey()
    uni.removeStorageSync(key)
  },

  logout() {
    state.isLoggedIn = false
    state.dashboardList = []
    uni.removeStorageSync('sc_is_logged_in')
    uni.removeStorageSync('sc_server')
    uni.removeStorageSync('sc_username')
    clearCookieJar()
  }
}
