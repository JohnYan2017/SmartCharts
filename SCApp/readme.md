# SmartChart App

SmartChart 数据报表移动端应用，基于 uni-app + Vue 3 构建，支持 H5、App、微信小程序三端运行。

## 功能概览

### 登录认证
- **账密登录**：用户名密码登录，支持记住密码、密码明密文切换
- **H5 同域自动识别**：H5 模式下自动使用 `window.location.origin` 作为服务器地址，无需用户输入
- **微信小程序登录**：调用 `uni.login` 获取 code → 后端换取 openid 自动创建/关联用户
- **企微 / 钉钉 OAuth 登录**：H5 浏览器重定向、App 端通过 WebView 子页面完成授权回调
- **服务器历史**：自动记忆最近使用过的 5 个服务器地址，支持快速切换

### 报表首页
- **项目分组展示**：按 SmartChart 项目分组，支持折叠/展开
- **无限层级菜单**：递归渲染报表目录树，支持任意深度的层级展开/收起
- **搜索过滤**：实时搜索报表名称，递归匹配所有层级节点
- **最近访问**：横向滚动卡片，记录最近 5 个访问过的报表，按服务器隔离存储
- **全部展开/收起**：一键递归操作所有层级节点
- **下拉刷新**：scroll-view 原生下拉刷新，滚动离开顶部时自动禁用防止误触
- **骨架屏 & 空状态**：加载中展示骨架动画，无报表/加载失败有友好提示与重试入口
- **离线检测**：断网状态红色横幅提示，网络恢复自动重试

### 报表查看
- **自定义导航栏**：统一三端导航体验，H5 端支持全屏按钮
- **H5 全屏模式**：CSS Fullscreen API，浮动退出按钮，硬件返回键优先退出全屏
- **App 原生 WebView**：通过 `plus.webview.create` 子 WebView 加载报表，cover-view 覆盖层显示加载/错误状态
- **Android 摄像头授权**：自动请求 Camera 权限 + 重写 WebChromeClient 授权 getUserMedia
- **Android 扫码补丁**：注入 JS 修复 WebView 中 OffscreenCanvas / srcObject / videoWidth 等兼容性问题
- **认证失效自动跳转**：H5 检测 iframe 被重定向到登录页时自动跳回 App 登录页

### 小程序端
- **web-view 壳子模式**：小程序仅作为 web-view 容器，加载配置的 H5 页面 URL
- **服务器配置页**：首次进入弹出配置页，支持输入/选择历史记录/保存
- **浮动设置按钮**：cover-view 覆盖在 web-view 上方，点击可通过 `showModal` 修改服务器地址

### 通用能力
- **Font Awesome 图标映射**：App 端不支持 Web 字体，自动将 FA 类名转为 Emoji 显示
- **全局认证拦截**：401/403 响应自动触发登录过期处理，跳转登录页

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Vue 3.4 + Composition API (`<script setup>`) |
| 跨端 | DCloud uni-app 3.x |
| 构建 | Vite 5 + @dcloudio/vite-plugin-uni |
| 状态管理 | Vue 3 reactive（轻量方案） |
| 平台 | H5 / App (Android·iOS) / 微信小程序 |

## 快速开始

### 环境要求

- Node.js >= 16
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### H5 开发

```bash
npm run dev:h5
```

启动后访问 http://127.0.0.1:5173/ ，开发服务器内置 Vite 同源代理插件，自动解决跨域 CSRF 问题。

### H5 构建

```bash
npm run build:h5
```

输出至 `dist/build/h5` 目录。

### H5 部署到 Django

```bash
npm run deploy:h5
```

将构建产物部署到 SmartChart Django 项目的 `static/mobile/` 和 `templates/mobile/` 目录。  
H5 通过 Django 的 `/m/` 路由提供访问，与后端同域部署，无需跨域配置。  
> **注意**：每次 `build:h5` 后必须重新执行部署（`deploy:h5` 已包含构建步骤），因为构建产物的文件名包含 hash，不部署会导致模板引用失效。

### App 开发 / 构建

```bash
npm run dev:app      # 开发模式
npm run build:app    # 生产构建（自动拷贝图标资源）
```

App 端使用 HBuilderX 进行云打包或本地打包。

### 微信小程序开发 / 构建

```bash
npm run dev:mp-weixin      # 开发模式
npm run build:mp-weixin    # 生产构建
npm run release:mp-weixin  # 生产构建（压缩）
npm run build:mp:server    # 生产构建 + 预配置默认服务器 URL
```

构建后使用微信开发者工具打开 `dist/build/mp-weixin` 目录。

### 打包时预配置默认服务器 URL

通过环境变量 `VITE_DEFAULT_SERVER` 可在构建时注入默认服务器地址，用户首次打开应用时无需手动输入：

```bash
# 注入默认 URL（App / 小程序生效）
VITE_DEFAULT_SERVER=https://smartchart.cn/m/ npm run build:mp-weixin
VITE_DEFAULT_SERVER=https://smartchart.cn/m/ npm run build:app

# 或使用快捷命令（已预配置 smartchart.cn）
npm run build:mp:server
```

- 用户手动修改过的地址优先于打包默认值（存储在 `uni.getStorageSync('sc_server')`）
- H5 模式不受影响，始终使用 `window.location.origin`
- 不设置该环境变量时默认为空字符串，用户需手动输入

## 项目结构

```
SCApp/
├── src/
│   ├── pages/
│   │   ├── index.vue              # 首页（H5/App: 报表列表 + 最近访问，MP: web-view 壳子）
│   │   ├── login.vue              # 登录页（账密/微信/企微/钉钉，H5 隐藏服务器地址）
│   │   ├── report.vue             # 报表查看页（WebView + 自定义导航栏）
│   │   ├── server-config.vue      # 服务器配置页（MP/App 使用，支持输入和历史记录）
│   │   └── webview-oauth.vue      # OAuth 授权页（App 端企微/钉钉回调）
│   ├── components/
│   │   └── SubNodes.vue           # 递归树节点（无限层级菜单）
│   ├── api/
│   │   └── smartchart.js          # API 封装（登录/微信/OAuth/报表列表）
│   ├── utils/
│   │   ├── request.js             # 请求封装（CSRF/Session/CookieJar/代理/全局认证拦截）
│   │   └── iconMap.js             # Font Awesome → Emoji 映射（150+ 图标）
│   ├── static/
│   │   ├── icons/                 # 第三方登录 SVG 图标（微信/企微/钉钉）
│   │   └── logo.png               # 应用 Logo
│   ├── store/
│   │   └── index.js               # 全局状态管理（reactive + 持久化存储）
│   ├── App.vue                    # 应用入口（onLaunch 路由守卫 + 认证过期监听）
│   ├── main.js                    # 入口文件（H5 代理启用）
│   ├── pages.json                 # 页面路由配置
│   ├── manifest.json              # 应用配置（appid、统计、平台设置）
│   └── uni.scss                   # 全局样式变量
├── scripts/
│   └── deploy-h5.sh               # H5 构建产物部署到 Django 脚本
├── vite.config.js                 # Vite 配置（含 API 同源代理插件 + 构建时常量注入）
├── package.json
└── README.md
```

## 认证机制

项目采用**三端分离**认证策略，根据运行平台自动选择合适的方式：

### 1. H5 同域 Cookie 模式

H5 与 Django 同域部署，浏览器自动管理 session cookie，无需额外参数。

- 服务器地址自动获取 `window.location.origin`，登录页隐藏服务器输入
- 登录成功后通过 `checkSession`（GET `/echart/`）确保 `sessionid` cookie 被浏览器正确设置
- 报表通过 `<web-view>` (iframe) 加载，同域 cookie 自动生效
- 生产构建自动剔除开发代理代码（Vite 静态替换 + tree-shaking）

### 2. App CookieJar 模式

App 环境下 `uni.request` 不自动管理 Cookie，项目手动维护 `cookieJar`：

- 解析响应 `Set-Cookie`，提取 `sessionid` 和 `csrftoken`，持久化到 Storage
- 每次请求手动附加 `Cookie` 和 `Referer` 请求头
- 登录时后端返回 JSON 200（而非 302），`app=true` 标记触发该行为
- 报表加载前通过 `injectCookiesToWebView` 将 session cookie 注入到原生 WebView 的 CookieManager：
  - Android：`CookieManager.setCookie`
  - iOS：`NSHTTPCookieStorage.setCookie`

### 3. 小程序 web-view 壳子模式

小程序仅作为 web-view 容器，加载配置的 H5 页面 URL。实际认证由 H5 页面内部的同域 Cookie 机制完成，小程序本身不参与认证。

### 登录流程

1. `ensureCsrfToken` — GET `/lg/` 获取 CSRF Token
2. POST `/lg/` 提交 Base64 编码的登录凭据（App 端附加 `app=true` 标记，后端返回 JSON 而非 302）
3. 后端返回 JSON `{ success: true/false }` 或 HTML 登录表单
4. H5 端：通过 `checkSession`（GET `/echart/`）确保 sessionid cookie 被浏览器设置
5. App 端：`request()` 自动将 Set-Cookie 中的 sessionid 存入 cookieJar

### 全局认证拦截

- `App.vue` 注册 `setOnAuthExpired` 回调，任何 API 返回 401/403 时自动清除登录状态并跳转登录页
- H5 报表页检测 iframe 是否被重定向到 Django 登录页 `/lg/`，若是则触发过期处理

### 第三方登录

| 方式 | H5 | App | 微信小程序 |
|------|-----|-----|----------|
| 微信 | — | — | `uni.login` → `/echart/wx_login/` |
| 企微 | 浏览器 OAuth 重定向 | WebView 子页面 + `state=app` | — |
| 钉钉 | 浏览器 OAuth 重定向 | WebView 子页面 + `state=app` | — |

App 端 OAuth 流程：获取 OAuth URL → 替换 `state=app` → 存入 storage → `webview-oauth.vue` 创建子 WebView 加载 → 拦截回调 URL → 从原生 CookieManager 提取 `sessionid` → 注入 cookieJar → 跳转首页。

## H5 开发代理

H5 开发模式下，`vite.config.js` 内置了 API 同源代理插件，解决跨域 CSRF 和 Cookie 共享问题：

- 代理路径格式：`/api/proxy/<protocol>/<host>/<path>`
- 自动转发 Cookie、CSRF Token 等关键请求头
- 改写 Origin/Referer 为目标服务器地址，绕过 Django CSRF 跨域校验
- 去除 Set-Cookie 中的 HttpOnly/Secure/SameSite 属性，使 JS 可读取 sessionid
- 跟随服务端重定向（最多 5 次），合并所有 Set-Cookie

**生产构建**：通过 `import.meta.env.PROD` 静态替换，`enableDevProxy()` 不会被调用，代理代码被 Vite tree-shaking 自动剔除，确保生产包零开销。

## 配置说明

### 服务器地址

- **H5 模式**：同域部署，自动使用 `window.location.origin`，登录页隐藏服务器地址输入
- **App 模式**：登录页「高级选项」中配置，或通过首页头部 ⚙ 按钮进入配置页修改；也可通过 `VITE_DEFAULT_SERVER` 打包时预配置
- **小程序模式**：首次进入自动跳转服务器配置页，输入完整的 H5 页面 URL（如 `https://smartchart.cn/m/`）；也可通过 `VITE_DEFAULT_SERVER` 打包时预配置

服务器历史自动记忆最近 5 个地址，支持快速切换。用户手动修改过的地址优先于打包默认值。

### uni 统计

已在 `manifest.json` 中关闭 uni 统计 2.0 埋点（`uniStatistics.enable: false`）。

## NPM Scripts

| 命令 | 说明 |
|------|------|
| `npm run dev:h5` | H5 开发服务 |
| `npm run build:h5` | H5 生产构建 |
| `npm run dev:app` | App 开发服务 |
| `npm run build:app` | App 生产构建（含图标资源拷贝） |
| `npm run dev:mp-weixin` | 微信小程序开发 |
| `npm run build:mp-weixin` | 微信小程序构建 |
| `npm run release:mp-weixin` | 微信小程序构建（压缩） |
| `npm run build:mp:server` | 微信小程序构建 + 预配置默认服务器 URL |
| `npm run deploy:h5` | H5 构建并部署到 Django（build + deploy-h5.sh） |
