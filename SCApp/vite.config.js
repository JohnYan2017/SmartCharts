import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'
import http from 'http'
import https from 'https'
import { URL } from 'url'

/**
 * H5 开发同源代理插件
 * 替代 dev-server.py，解决跨域 CSRF Cookie 问题
 * 路径格式：/api/proxy/<protocol>/<host>/<api_path>
 */
function apiProxyPlugin() {
  return {
    name: 'api-proxy',
    enforce: 'pre',  // 在 connect body parser 之前运行，避免 req 流被提前消耗
    configureServer(server) {
      server.middlewares.use('/api/proxy', (req, res, next) => {
        const match = req.url.match(/^\/(https?)\/([^/]+)(.*)/)
        if (!match) {
          res.statusCode = 400
          res.end('无效的代理路径')
          return
        }

        const [, protocol, host, apiPath] = match
        const targetUrl = `${protocol}://${host}${apiPath || '/'}`
        const lib = protocol === 'https' ? https : http

        console.log(`[PROXY] ${req.method} ${targetUrl}`)

        // 收集请求体（POST/PUT）
        let bodyChunks = []
        let requestHandled = false  // 防止 handleRequest 被调用两次
        const handleRequest = () => {
          if (requestHandled) return
          requestHandled = true
          const reqHeaders = {}
          const fwdHeaders = ['content-type', 'x-csrftoken', 'cookie', 'x-requested-with']
          for (const h of fwdHeaders) {
            if (req.headers[h]) reqHeaders[h] = req.headers[h]
          }
          // 改写 Origin/Referer 为目标服务器，避免 Django CSRF 跨域校验失败
          reqHeaders['origin'] = `${protocol}://${host}`
          reqHeaders['referer'] = `${protocol}://${host}${apiPath || '/'}`

          // connect 中间件可能已解析了 application/x-www-form-urlencoded 的 body，
          // 导致 req 流被消耗，需从 req.body 重新序列化
          if (req.body && typeof req.body === 'object' && !(req.body instanceof Buffer)) {
            const contentType = req.headers['content-type'] || ''
            let bodyStr
            if (contentType.includes('application/x-www-form-urlencoded')) {
              bodyStr = Object.entries(req.body)
                .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
                .join('&')
            } else {
              bodyStr = JSON.stringify(req.body)
            }
            bodyChunks.push(Buffer.from(bodyStr))
            // 更新 Content-Length（重新序列化后长度可能不同）
            reqHeaders['content-length'] = String(bodyChunks[0].length)
          }

          // 显式设置 Content-Length，避免 chunked 传输（Django WSGI 对 chunked 表单解析有问题）
          if (bodyChunks.length > 0) {
            const totalLen = bodyChunks.reduce((sum, c) => sum + c.length, 0)
            reqHeaders['content-length'] = String(totalLen)
          }

          const parsed = new URL(targetUrl)
          const opts = {
            hostname: parsed.hostname,
            port: parsed.port || (protocol === 'https' ? 443 : 80),
            path: parsed.pathname + parsed.search,
            method: req.method,
            headers: reqHeaders
          }

          const proxyReq = lib.request(opts, (proxyRes) => {
            // 收集所有 Set-Cookie（含重定向链中的）
            let allSetCookies = [...(proxyRes.headers['set-cookie'] || [])]

            const handleFinalResponse = (statusCode, body) => {
              res.statusCode = statusCode
              // 转发响应头（排除 hop-by-hop 和 set-cookie）
              for (const [k, v] of Object.entries(proxyRes.headers)) {
                const kl = k.toLowerCase()
                if (['transfer-encoding', 'connection', 'set-cookie'].includes(kl)) continue
                res.setHeader(k, v)
              }
              // 写入合并后的 Set-Cookie（必须用数组一次性设置，否则 setHeader 会覆盖）
              // 开发代理：去掉 HttpOnly/Secure/SameSite，让 JS 能读取 sessionid（用于 st token 认证）
              if (allSetCookies.length > 0) {
                const cleanedCookies = allSetCookies.map(sc =>
                  sc.replace(/;\s*HttpOnly/gi, '')
                    .replace(/;\s*Secure/gi, '')
                    .replace(/;\s*SameSite=[^;]*/gi, '')
                )
                res.setHeader('Set-Cookie', cleanedCookies)
              }
              res.end(body)
            }

            // 处理重定向（最多 5 次）
            const followRedirects = (currentRes, currentReq, depth) => {
              if (depth > 5) {
                res.statusCode = 502
                res.end('重定向次数过多')
                return
              }

              const status = currentRes.statusCode
              if (status >= 300 && status < 400 && currentRes.headers.location) {
                // 收集重定向的 Set-Cookie
                const redirectCookies = currentRes.headers['set-cookie'] || []
                allSetCookies = allSetCookies.concat(redirectCookies)

                let location = currentRes.headers.location
                if (location.startsWith('/')) {
                  location = `${protocol}://${host}${location}`
                }
                console.log(`  → 跟随重定向: ${status} → ${location}`)

                const locParsed = new URL(location)
                const newOpts = {
                  hostname: locParsed.hostname,
                  port: locParsed.port || (locParsed.protocol === 'https:' ? 443 : 80),
                  path: locParsed.pathname + locParsed.search,
                  method: 'GET',
                  headers: {}
                }
                // 携带原始 Cookie
                if (req.headers.cookie) newOpts.headers.cookie = req.headers.cookie
                // 如果重定向 Set-Cookie 里有 csrftoken，追加到 Cookie
                for (const sc of redirectCookies) {
                  const m = sc.match(/csrftoken=([^;]+)/)
                  if (m) {
                    const existing = newOpts.headers.cookie || ''
                    if (!existing.includes('csrftoken')) {
                      newOpts.headers.cookie = existing
                        ? existing + '; csrftoken=' + m[1]
                        : 'csrftoken=' + m[1]
                    }
                  }
                }

                const newLib = locParsed.protocol === 'https:' ? https : http
                const redirectReq = newLib.request(newOpts, (redirectRes) => {
                  followRedirects(redirectRes, redirectReq, depth + 1)
                })
                redirectReq.on('error', (e) => {
                  console.error('[PROXY ERROR]', e.message)
                  res.statusCode = 502
                  res.end('代理请求失败: ' + e.message)
                })
                redirectReq.end()
              } else {
                // 非重定向，读取 body 并返回
                const chunks = []
                currentRes.on('data', (chunk) => chunks.push(chunk))
                currentRes.on('end', () => {
                  handleFinalResponse(status, Buffer.concat(chunks))
                })
              }
            }

            followRedirects(proxyRes, proxyReq, 0)
          })

          proxyReq.on('error', (e) => {
            console.error('[PROXY ERROR]', e.message)
            res.statusCode = 502
            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            res.end('无法连接后端: ' + e.message)
          })

          if (bodyChunks.length > 0) {
            proxyReq.write(Buffer.concat(bodyChunks))
          }
          proxyReq.end()
        }

        if (req.method === 'POST' || req.method === 'PUT') {
          req.on('data', (chunk) => bodyChunks.push(chunk))
          req.on('end', handleRequest)
          // connect 中间件已解析 body 时，流不会再触发 data/end，直接调用
          if (req.body && typeof req.body === 'object' && !(req.body instanceof Buffer)) {
            handleRequest()
          }
        } else {
          handleRequest()
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [uni(), apiProxyPlugin()],
  define: {
    // 打包时注入默认服务器 URL，用法：
    //   VITE_DEFAULT_SERVER=https://smartchart.cn/m/ npm run build:mp-weixin
    // 不设置则为空字符串，用户需手动输入
    __DEFAULT_SERVER__: JSON.stringify(process.env.VITE_DEFAULT_SERVER || '')
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
