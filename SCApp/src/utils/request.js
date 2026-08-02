/**
 * 网络请求封装 - 处理 CSRF、Session Cookie、全局认证拦截
 */
// 开发环境才打印调试日志，生产包自动剔除（Vite 静态替换 + tree-shaking）
const IS_DEV = import.meta.env.DEV
export function log(...args) { if (IS_DEV) console.log(...args) }

let csrfToken = ''
let devProxy = false  // H5 开发代理模式
let sessionId = ''    // Django sessionid（用于 web-view 无 cookie 场景）

// #ifndef H5
// App 环境下 uni.request 不自动管理 Cookie，需手动维护 cookieJar
let cookieJar = {}

export function parseSetCookie(setCookieHeader) {
  if (!setCookieHeader) return
  // Set-Cookie 可能是数组、字符串
  let cookies
  if (Array.isArray(setCookieHeader)) {
    cookies = setCookieHeader
  } else {
    // uni-app App-Plus 可能将多个 Set-Cookie 拼成一个带 [] 的字符串
    let str = setCookieHeader
    // 去掉首尾的方括号
    if (str.charAt(0) === '[') str = str.slice(1)
    if (str.charAt(str.length - 1) === ']') str = str.slice(0, -1)
    // 多个 cookie 用 ", " 分隔，但 expires 日期里也有逗号
    // 用正则：只在 ", " 后面跟着 "名字=" 模式时才拆分
    cookies = str.split(/,\s*(?=[a-zA-Z][a-zA-Z0-9_-]*=)/)
  }
  for (const cookie of cookies) {
    const match = cookie.match(/^([^=]+)=([^;]+)/)
    if (match) {
      const key = match[1].trim()
      // 跳过非法 key（如 "[csrftoken"）
      if (/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(key)) {
        cookieJar[key] = match[2].trim()
      }
    }
  }
  try { uni.setStorageSync('cookieJar', JSON.stringify(cookieJar)) } catch (e) {}
}

// 启动时恢复持久化的 cookie
try {
  const saved = uni.getStorageSync('cookieJar')
  if (saved) cookieJar = JSON.parse(saved)
} catch (e) {}
// #endif

export function getCookieHeader() {
  // #ifndef H5
  return Object.entries(cookieJar).map(([k, v]) => k + '=' + v).join('; ')
  // #endif
  // #ifdef H5
  return ''
  // #endif
}

// 全局认证失效回调（由 App 层注册）
let onAuthExpired = null
export function setOnAuthExpired(fn) { onAuthExpired = fn }

// 开发代理：所有请求改写为同源 /api/ 前缀
export function enableDevProxy() { devProxy = true }
export function disableDevProxy() { devProxy = false }
export function isDevProxy() { return devProxy }
export function getSessionId() {
  // 优先从缓存返回，H5 模式下也尝试从 cookie 读取
  if (!sessionId) {
    // #ifdef H5
    try {
      const match = document.cookie.match(/sessionid=([^;]+)/)
      if (match) sessionId = match[1]
    } catch (e) {}
    // #endif
  }
  return sessionId
}

function rewriteUrl(url) {
  if (!devProxy) return url
  // http://8.163.41.108/lg/ → /api/proxy/http/8.163.41.108/lg/
  // https://example.com:8000/lg/ → /api/proxy/https/example.com:8000/lg/
  const m = url.match(/^(https?):\/\/([^/]+)(.*)/)
  if (!m) return url
  return '/api/proxy/' + m[1] + '/' + m[2] + m[3]
}

/**
 * 将绝对 URL 转换为代理 URL（仅 H5 开发模式）
 * 用于 WebView 加载报表页面，使其共享 Django session cookie
 */
export function proxyUrl(url) {
  if (!devProxy) return url
  const m = url.match(/^(https?):\/\/([^/]+)(.*)/)
  if (!m) return url
  return '/api/proxy/' + m[1] + '/' + m[2] + m[3]
}

function parseCsrfFromBody(data) {
  if (!data) return null
  // 从 HTML 中提取 csrfmiddlewaretoken
  const str = typeof data === 'string' ? data : JSON.stringify(data)
  const match = str.match(/name="csrfmiddlewaretoken"\s+value="([^"]+)"/)
  if (match) return match[1]
  // 从 Cookie header 中提取
  const cookieMatch = str.match(/csrftoken=([^;]+)/)
  return cookieMatch ? cookieMatch[1] : null
}

// H5 下从 document.cookie 读取 csrftoken
function readCsrfFromCookie() {
  // #ifdef H5
  try {
    const match = document.cookie.match(/csrftoken=([^;]+)/)
    if (match) return match[1]
  } catch (e) {}
  // #endif
  return null
}

export async function ensureCsrfToken(server, forceRefresh) {
  // 非强制刷新时，有缓存就直接用
  if (csrfToken && !forceRefresh) return csrfToken
  // 非强制刷新时，H5 先尝试从 cookie 读取
  if (!forceRefresh) {
    const cookieCsrf = readCsrfFromCookie()
    if (cookieCsrf) {
      csrfToken = cookieCsrf
      return csrfToken
    }
  }
  // 强制刷新或无缓存：从服务器 GET 新 token
  csrfToken = ''
  const _lgUrl = server + '/lg/?app=true'
  return new Promise((resolve, reject) => {
    // #ifndef H5
    const _headers = {}
    const _cookieStr = getCookieHeader()
    if (_cookieStr) _headers['Cookie'] = _cookieStr
    try {
      const m = _lgUrl.match(/^(https?:\/\/[^/]+)/)
      if (m) _headers['Referer'] = m[1] + '/'
    } catch (e) {}
    // #endif
    uni.request({
      url: rewriteUrl(_lgUrl),
      method: 'GET',
      // #ifndef H5
      header: _headers,
      // #endif
      withCredentials: true,
      timeout: 10000,
      success: (res) => {
        const rawSetCookie = res.header['Set-Cookie'] || res.header['set-cookie'] || ''
        // #ifndef H5
        parseSetCookie(rawSetCookie)
        // #endif
        csrfToken = parseCsrfFromBody(res.data)
        if (!csrfToken) {
          const csMatch = rawSetCookie.match(/csrftoken=([^;]+)/)
          csrfToken = csMatch ? csMatch[1] : ''
        }
        resolve(csrfToken || '')
      },
      fail: (err) => {
        reject(new Error('无法连接服务器: ' + err.errMsg))
      }
    })
  })
}

export function request(options) {
  return new Promise((resolve, reject) => {
    const headers = { ...options.header }
    // 标记是否为登录请求（登录请求的 403 不走全局拦截）
    const isLoginReq = options._isLogin === true

    // 如果没有 csrfToken，先尝试从 cookie 读取
    if (!csrfToken) {
      const cookieCsrf = readCsrfFromCookie()
      if (cookieCsrf) csrfToken = cookieCsrf
    }

    if (csrfToken && options.method !== 'GET') {
      headers['X-CSRFToken'] = csrfToken
    }

    // #ifndef H5
    // App 环境手动带 Cookie header
    const cookieStr = getCookieHeader()
    if (cookieStr) headers['Cookie'] = cookieStr
    // Referer 帮助 Django CSRF 校验通过
    try {
      const m = options.url.match(/^(https?:\/\/[^/]+)/)
      if (m) headers['Referer'] = m[1] + '/'
    } catch (e) {}
    // #endif

    uni.request({
      url: rewriteUrl(options.url),
      method: options.method || 'GET',
      data: options.data,
      header: headers,
      withCredentials: true,
      timeout: options.timeout || 15000,
      success: (res) => {
        // 从 Set-Cookie 更新 csrfToken（App/小程序）
        const setCookie = res.header['Set-Cookie'] || res.header['set-cookie'] || ''
        // #ifndef H5
        parseSetCookie(setCookie)
        // #endif
        const match = setCookie.match(/csrftoken=([^;]+)/)
        if (match) csrfToken = match[1]

        // 从 Set-Cookie 提取 sessionid（App/小程序 web-view 需要）
        const sidMatch = setCookie.match(/sessionid=([^;]+)/)
        if (sidMatch) sessionId = sidMatch[1]
        // #ifndef H5
        if (cookieJar['sessionid']) sessionId = cookieJar['sessionid']
        // #endif

        // H5: 从 cookie 更新 csrfToken
        if (!csrfToken) {
          const cookieCsrf = readCsrfFromCookie()
          if (cookieCsrf) csrfToken = cookieCsrf
        }

        // 全局认证失效拦截（排除登录请求自身）
        if (!isLoginReq && (res.statusCode === 401 || res.statusCode === 403)) {
          if (onAuthExpired) onAuthExpired()
          reject(new Error('登录已过期，请重新登录'))
          return
        }

        if (res.statusCode >= 200 && res.statusCode < 400) {
          // 返回 statusCode + 原始数据，供上层判断
          resolve({ _statusCode: res.statusCode, _data: res.data })
        } else {
          reject(new Error(`请求失败(${res.statusCode})`))
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败: ' + err.errMsg))
      }
    })
  })
}

export function resetCsrfToken() {
  csrfToken = ''
  // #ifndef H5
  // App 端从 cookieJar 读取新的 csrftoken
  if (cookieJar['csrftoken']) {
    csrfToken = cookieJar['csrftoken']
  }
  // #endif
  // H5: 登录后 Django 轮换 CSRF token，从 cookie 读取新的
  const cookieCsrf = readCsrfFromCookie()
  if (cookieCsrf) {
    csrfToken = cookieCsrf
  }
}

export function clearCookieJar() {
  // #ifndef H5
  cookieJar = {}
  sessionId = ''
  try { uni.removeStorageSync('cookieJar') } catch (e) {}
  // #endif
}

/**
 * 外部注入 sessionid 到 cookieJar（供 OAuth webview 回调使用）
 */
export function setSessionCookie(sid) {
  // #ifndef H5
  if (!sid) return
  cookieJar['sessionid'] = sid
  sessionId = sid
  try { uni.setStorageSync('cookieJar', JSON.stringify(cookieJar)) } catch (e) {}
  // #endif
}

/**
 * Session 有效性校验
 * 调用一个轻量 GET 接口，检查 Session 是否仍然有效
 * 返回 true=Session 有效，false=Session 失效
 */
export async function checkSession(server) {
  try {
    const res = await new Promise((resolve, reject) => {
      uni.request({
        url: rewriteUrl(server + '/echart/'),
        method: 'GET',
        withCredentials: true,
        timeout: 8000,
        success: resolve,
        fail: reject
      })
    })
    if (res.statusCode === 401 || res.statusCode === 403) return false
    // Vite 代理会跟随重定向，session 过期时返回登录页（HTTP 200），需检测内容
    const data = typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
    if (data.includes('csrfmiddlewaretoken') || data.includes('type="password"')) return false
    return res.statusCode >= 200 && res.statusCode < 400
  } catch (e) {
    return true // 网络错误时假定有效，避免误判
  }
}
