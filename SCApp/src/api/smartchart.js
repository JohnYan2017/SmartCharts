/**
 * SmartChart API 封装
 */
import { ensureCsrfToken, request, resetCsrfToken, checkSession, getSessionId, clearCookieJar, log } from '@/utils/request.js'

/**
 * Base64 编码（兼容 H5 / App / 小程序）
 * 小程序无 btoa/atob，使用 uni.arrayBufferToBase64
 */
function base64Encode(str) {
  // #ifdef H5
  if (typeof btoa === 'function') {
    return btoa(unescape(encodeURIComponent(str)))
  }
  // #endif
  const encoded = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode('0x' + p1)
  )
  const buffer = new ArrayBuffer(encoded.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < encoded.length; i++) {
    view[i] = encoded.charCodeAt(i)
  }
  return uni.arrayBufferToBase64(buffer)
}

function encodeLoginData(username, password, nextUrl) {
  const payload = {
    username: username,
    password: password,
    next: nextUrl || '/'
  }
  // #ifndef H5
  // App 端标记：后端收到后返回 JSON 200 而非 302 重定向
  // 避免 uni.request 跟随 302 时丢失 Set-Cookie: sessionid
  payload.app = true
  // #endif
  return base64Encode(JSON.stringify(payload))
}

/**
 * 检测登录是否失败，返回错误信息（null 表示成功）
 * 后端可能返回 JSON { success: false, message: '...' } 或 HTML 登录表单
 */
function getLoginError(data) {
  if (!data) return null
  // JSON 响应：{ success: false, message: '...' }
  if (typeof data === 'object' && data !== null) {
    if (data.success === false) {
      return data.message || '用户名或密码错误'
    }
    return null
  }
  // 字符串响应：检测 Django 登录表单 HTML
  const str = typeof data === 'string' ? data : JSON.stringify(data)
  if (str.includes('csrfmiddlewaretoken') || str.includes('type="password"')) {
    return '用户名或密码错误'
  }
  // 字符串可能是未解析的 JSON
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      if (parsed && parsed.success === false) {
        return parsed.message || '用户名或密码错误'
      }
    } catch (e) {}
  }
  return null
}

export async function login(server, username, password) {
  try {
    // 登录前清旧 cookie，强制从服务器获取新的 CSRF Token
    // #ifndef H5
    clearCookieJar()
    // #endif
    const csrf = await ensureCsrfToken(server, true)
    const loginData = encodeLoginData(username, password, '/echart/')
    // #ifndef H5
    log('[login] App-Plus: POST /lg/ with app=true, csrf:', csrf ? 'yes' : 'no')
    // #endif
    const result = await request({
      url: server + '/lg/',
      method: 'POST',
      data: { data: loginData },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 15000,
      _isLogin: true  // 登录请求不走全局 403 拦截
    })

    // #ifndef H5
    log('[login] response data:', JSON.stringify(result._data))
    // #endif

    // 后端密码错误时返回 JSON { success: false } 或 HTML 登录表单（HTTP 200）
    const errMsg = getLoginError(result._data)
    if (errMsg) {
      resetCsrfToken()
      return { success: false, message: errMsg }
    }

    // Django login 会轮换 csrftoken，清掉缓存让后续请求重新获取
    resetCsrfToken()

    // #ifndef H5
    // App 端：后端已改为返回 JSON 200（不再 302），sessionid 在 Set-Cookie 中
    // request() 已自动将 sessionid 存入 cookieJar，无需额外 checkSession
    log('[login] success, sessionId:', getSessionId() ? 'found' : 'NOT found')
    return { success: true, data: result._data }
    // #endif

    // H5 端：初始化 session，确保 sessionid cookie 被浏览器正确设置
    await checkSession(server)
    getSessionId()

    return { success: true, data: result._data }
  } catch (err) {
    // #ifndef H5
    log('[login] error:', err.message)
    // #endif
    resetCsrfToken()
    return { success: false, message: err.message }
  }
}

/**
 * 微信小程序登录（后端 @csrf_exempt，无需 CSRF Token）
 * uni.login 获取 code → 发送到后端 wx_login → 后端调 jscode2session 获取 openid → 创建/查找用户 → 返回 session
 */
export async function wxLogin(server) {
  try {
    // #ifndef H5
    clearCookieJar()
    // #endif

    // 1. 调用 uni.login 获取微信授权码
    const loginResult = await new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: resolve,
        fail: reject
      })
    })
    const code = loginResult.code
    if (!code) {
      return { success: false, message: '微信授权失败：未获取到授权码' }
    }

    // 2. 发送 code 到后端换取 session
    const result = await request({
      url: server + '/echart/wx_login/',
      method: 'POST',
      data: { code },
      header: { 'Content-Type': 'application/json' },
      timeout: 15000,
      _isLogin: true
    })

    // 3. 处理响应：直接透传后端返回的 message
    const data = result._data
    if (data && data.success) {
      return { success: true, data }
    } else {
      const serverMsg = (data && data.message) ? data.message : ''
      return { success: false, message: serverMsg || '微信登录失败' }
    }
  } catch (err) {
    return { success: false, message: err.message || err.errMsg || '微信登录异常' }
  }
}

/**
 * 获取第三方 OAuth 登录地址
 * @param {string} server 服务器地址
 * @param {string} type   '_qiwei'(企微) | '_dingding'(钉钉)
 * @returns {Promise<{success, oauthUrl?, message?}>}
 */
export async function getThirdLoginUrl(server, type) {
  try {
    const result = await request({
      url: server + '/echart/third_login/?t=' + type,
      method: 'GET',
      timeout: 10000,
      _isLogin: true
    })
    const data = result._data
    if (data && data.status === 200 && data.msg) {
      // msg 可能是对象（如 {url: "..."}），需提取为字符串
      const url = typeof data.msg === 'object' ? (data.msg.url || data.msg.href || JSON.stringify(data.msg)) : String(data.msg)
      return { success: true, oauthUrl: url }
    }
    const errDetail = data && data.msg ? (typeof data.msg === 'object' ? JSON.stringify(data.msg) : data.msg) : ''
    return { success: false, message: errDetail || '管理员未开启该登录方式' }
  } catch (err) {
    return { success: false, message: err.message || '获取登录地址失败' }
  }
}

/**
 * 企微 / 钉钉 OAuth 登录
 * H5:  获取 OAuth URL → 浏览器重定向 → 用户授权 → 回调设 session → 跳回首页
 * App: 获取 OAuth URL → 替换 state=app → 存入 storage → 由 login.vue 跳转 webview 页面
 */
export async function oauthLogin(server, type) {
  const res = await getThirdLoginUrl(server, type)
  if (!res.success) return res

  let oauthUrl = res.oauthUrl
  log('[oauthLogin] raw oauthUrl:', oauthUrl)

  // 确保 oauthUrl 是绝对 URL；相对路径时用 server（origin）拼接，避免基于 /m/ 解析
  if (oauthUrl && !/^https?:\/\//i.test(oauthUrl)) {
    const base = server || window.location.origin
    oauthUrl = base + (oauthUrl.startsWith('/') ? '' : '/') + oauthUrl
    log('[oauthLogin] resolved to absolute:', oauthUrl)
  }

  // #ifdef H5
  // H5: 直接浏览器跳转，OAuth 回调后 session 自动设置
  window.location.href = oauthUrl
  return { success: true, message: '正在跳转授权页面...' }
  // #endif

  // #ifndef H5
  // App: 把 state 参数改成 app，后端收到后返回 JSON 而非 redirect
  if (/[?&]state=[^&]*/.test(oauthUrl)) {
    oauthUrl = oauthUrl.replace(/([?&])state=[^&]*/, '$1state=app')
  } else {
    oauthUrl += '&state=app'
  }
  uni.setStorageSync('oauth_url', oauthUrl)
  return { success: true, oauthUrl }
  // #endif
}

export async function getDashboardList(server, mode) {
  const body = mode === 'all' ? {} : { mode: mode || 'mobile' }
  try {
    const result = await request({
      url: server + '/echart/index_api/',
      method: 'POST',
      data: body,
      header: { 'Content-Type': 'application/json' },
      timeout: 15000
    })
    return { success: true, data: result._data }
  } catch (err) {
    return { success: false, message: err.message }
  }
}
