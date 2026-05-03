# Part 3：架构介绍与美工设计说明文档

## 一、整体架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           你的 VPS                                      │
│                                                                         │
│  ┌───────────────────────────────────────────────┐                      │
│  │  OpenResty (www.20268866.xyz:443)              │                      │
│  │                                               │                      │
│  │  /              → dist/index.html (SPA)       │                      │
│  │  /assets/*      → dist/assets/ (带 hash 缓存)  │                      │
│  │  /login, /tokens, ...  → dist/index.html      │  ← try_files 回退    │
│  │                                               │                      │
│  │  /api/*  → proxy_pass → 127.0.0.1:3002        │  ← 后端管理接口      │
│  │           + 注入 Cookie header                 │                      │
│  └───────────────────────┬───────────────────────┘                      │
│                          │                                              │
│  ┌───────────────────────▼───────────────────────┐                      │
│  │  New API 后端 (Docker: calciumion/new-api)     │                      │
│  │  容器内 :3000 → 宿主机 :3002                    │                      │
│  │                                               │                      │
│  │  认证：Cookie (session) + New-Api-User (id)    │                      │
│  │  数据库：MySQL + Redis                         │                      │
│  └───────────────────────────────────────────────┘                      │
│                                                                         │
│  ┌───────────────────────────────────────────────┐                      │
│  │  api.20268866.xyz (后端原管理面板 + API relay)  │                      │
│  │  客户端工具的 Base URL 指向这里                  │                      │
│  │  /v1/chat/completions → 后端                   │                      │
│  │  /anthropic/v1/messages → 后端                 │                      │
│  └───────────────────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────────────┘
```

## 二、认证流程

```
用户点击「登录」
    │
    ▼
POST /api/user/login {username, password}
    │
    ▼
后端返回：
  Set-Cookie: session=MTc3... (HttpOnly, SameSite=Strict)
  Body: { data: { id: 4, username: "test11", group: "top", ... } }
    │
    ▼
前端处理：
  1. 从 response body 取出 user.id → 存入 localStorage (auth-store)
  2. 设置 isAuthenticated = true
  3. 浏览器自动保存 session cookie
    │
    ▼
后续每个请求 (axios interceptor):
  Cookie: session=MTc3...        ← 浏览器自动发送
  New-Api-User: 4                ← axios 从 localStorage 读取 user.id 注入
    │
    ▼
后端验证：Cookie 校验 session + New-Api-User 确认用户身份
```

## 三、数据流：后端 API 格式适配

```
后端 calciumion/new-api 返回分页格式：
{
  "success": true,
  "data": {
    "page": 1,
    "page_size": 10,
    "total": 25,
    "items": [ ... ]              ← 实际数据在这里
  }
}

前端统一用 extractItems() 函数适配：
  data 是数组    → 直接使用
  data.items 存在 → 取 data.items
  否则           → 空数组

涉及文件：useTokens.ts, Logs.tsx, Clients.tsx, authStore.ts
```

## 四、分层架构与修改规则

```
┌─────────────────────────────────────────────────────────────────────┐
│                        分层架构                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🟢 表现层 — 可以随意修改外观                                         │
│  ├── src/theme/tokens.css        颜色/字体/间距/阴影                  │
│  ├── src/theme/globals.css       全局样式/动画                        │
│  ├── src/components/ui/*.tsx     按钮/卡片/输入框等外观               │
│  ├── src/components/layout/*.tsx 侧边栏/顶栏/整体布局                │
│  └── src/pages/*.tsx             每个页面的排版和区块                 │
│                                                                     │
│  🟡 配置层 — 修改配置值                                              │
│  ├── src/site.config.ts          站点名/域名/客服                    │
│  ├── src/data/clients.ts         客户端列表和教程                    │
│  └── src/i18n/locales/*.json     翻译文案                            │
│                                                                     │
│  🔴 逻辑层 — 不要修改                                                │
│  ├── src/api/                    API 通信                            │
│  ├── src/store/                  状态管理                            │
│  ├── src/features/               业务 Hook                          │
│  ├── src/utils/                  工具函数                            │
│  └── src/types/                  类型定义                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 五、美工设计修改指南

### 5.1 修改颜色

所有颜色定义在 `src/theme/tokens.css` 中：

```
文件：src/theme/tokens.css

结构：
  :root, [data-theme='light'] {    ← 亮色模式
    --color-bg-primary: #FAF6F1;   ← 主背景（羊皮卷米色）
    --color-accent: #C2410C;       ← 强调色（Anthropic 橙棕色）
    ...
  }
  
  [data-theme='dark'] {            ← 暗色模式
    --color-bg-primary: #1C1917;   ← 主背景（暖黑色）
    --color-accent: #EA580C;       ← 强调色（暗色下稍亮）
    ...
  }

修改方法：
  直接改 CSS 变量的 HEX 值
  两套模式都要改（除非你只用一种）
  重新 build 后立即生效
```

**变量名速查表：**

| 变量 | 用途 | 亮色默认值 | 暗色默认值 |
|------|------|-----------|-----------|
| `--color-bg-primary` | 页面主背景 | `#FAF6F1` | `#1C1917` |
| `--color-bg-secondary` | 次要背景/分隔 | `#F5EDE4` | `#292524` |
| `--color-bg-card` | 卡片背景 | `#FFFFFF` | `#292524` |
| `--color-bg-card-hover` | 卡片悬停 | `#FDF9F5` | `#332E2B` |
| `--color-bg-input` | 输入框背景 | `#FFFFFF` | `#1C1917` |
| `--color-bg-code` | 代码块背景 | `#F5EDE4` | `#1C1917` |
| `--color-border` | 边框 | `#E8DFD3` | `#44403C` |
| `--color-text-primary` | 主要文字 | `#1C1917` | `#FAFAF9` |
| `--color-text-secondary` | 次要文字 | `#57534E` | `#D6D3D1` |
| `--color-text-muted` | 淡化文字 | `#A8A29E` | `#78716C` |
| `--color-accent` | 品牌强调色 | `#C2410C` | `#EA580C` |
| `--color-accent-hover` | 强调色悬停 | `#9A3412` | `#F97316` |
| `--color-accent-soft` | 强调色淡底 | `#FFF7ED` | `#431407` |
| `--color-accent-text` | 强调色文字 | `#C2410C` | `#FB923C` |
| `--color-success` | 成功/正面 | `#16A34A` | `#22C55E` |
| `--color-warning` | 警告 | `#CA8A04` | `#EAB308` |
| `--color-danger` | 危险/错误 | `#DC2626` | `#EF4444` |
| `--color-info` | 信息 | `#2563EB` | `#3B82F6` |
| `--color-purple` | 紫色标签 | `#7C3AED` | `#A78BFA` |

### 5.2 修改字体

```css
/* src/theme/globals.css 中修改 */
@theme {
  --font-sans: 'Inter', 'Noto Sans SC', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

/* 要用其他字体：
   1. 在 index.html 中添加 Google Fonts 链接
   2. 在这里修改 font-family */
```

### 5.3 修改圆角

```
圆角由组件的 Tailwind class 控制：
  rounded-xl  → 12px（卡片、输入框）
  rounded-2xl → 16px（大卡片）
  rounded-lg  → 8px（按钮、徽章）
  rounded-full → 50%（头像）

要全局改圆角，用搜索替换：
  rounded-2xl → rounded-lg     让所有大卡片变更小圆角
  rounded-xl  → rounded-md     让所有中等元素变更小圆角
```

### 5.4 修改布局

```
当前布局：左侧边栏 + 顶栏 + 内容区

要改成顶部导航栏布局：
  1. 修改 src/components/layout/Layout.tsx
  2. 修改 src/components/layout/Sidebar.tsx → 改成水平导航
  3. 删除 Layout 中的 marginLeft 逻辑

要改成居中窄版布局：
  在 Layout.tsx 的 <main> 标签上调整 max-w-7xl → max-w-4xl
```

### 5.5 修改页面内区块顺序

```
每个页面文件（src/pages/*.tsx）的 JSX 结构都是从上到下排列的。

例如 Home.tsx：
  <div>
    {/* Hero 区 */}       ← 移到下面就变成非首屏
    {/* 公告 */}           ← 删除这段就不显示公告
    {/* 特性介绍 */}       ← 改里面的数组就改特性内容
    {/* 快速导航 */}       ← 增减 quickLinks 数组改导航项
  </div>

直接剪切粘贴 JSX 块就能调整顺序，不影响逻辑。
```

### 5.6 修改动画

```
动画来自两个地方：

1. Framer Motion（页面级动画）
   在 pages/*.tsx 中搜索 <motion.div>
   initial={{ opacity: 0, y: 8 }}     ← 初始状态
   animate={{ opacity: 1, y: 0 }}     ← 最终状态
   transition={{ delay: i * 0.02 }}   ← 时长和延迟
   
   去掉动画：把 <motion.div> 改成 <div>

2. CSS 过渡（组件级）
   在 globals.css 中的 @keyframes
   在组件中的 transition-all duration-200
   
   改过渡速度：duration-200 → duration-300（更慢）
   去掉过渡：删除 transition-all
```

### 5.7 快速风格切换示例

**示例：从 Anthropic 羊皮卷风格切换到冷色科技风**

只需修改 `src/theme/tokens.css`：

```css
:root, [data-theme='light'] {
  --color-bg-primary: #F8FAFC;      /* 冷白 */
  --color-bg-secondary: #F1F5F9;
  --color-bg-card: #FFFFFF;
  --color-border: #E2E8F0;
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-accent: #2563EB;          /* 蓝色 */
  --color-accent-hover: #1D4ED8;
  --color-accent-soft: #EFF6FF;
  --color-accent-text: #2563EB;
}

[data-theme='dark'] {
  --color-bg-primary: #0F172A;      /* 深蓝黑 */
  --color-bg-secondary: #1E293B;
  --color-bg-card: #1E293B;
  --color-border: #334155;
  --color-text-primary: #F8FAFC;
  --color-text-secondary: #CBD5E1;
  --color-accent: #3B82F6;
  --color-accent-hover: #60A5FA;
  --color-accent-soft: #172554;
  --color-accent-text: #60A5FA;
}
```

改这一个文件，重新 build，整站风格完全变化，**零逻辑修改**。

---

## 六、一键更新脚本

```bash
#!/bin/bash
# /home/cxadmin/ai-gateway-frontend/deploy.sh
set -e
cd /home/cxadmin/ai-gateway-frontend
echo "📦 Building..."
pnpm run build
echo "🚀 Deploying..."
sudo cp -r dist/* /www/sites/www.20268866.xyz/index/
echo "✅ Done! Visit https://www.20268866.xyz"
```

```bash
chmod +x /home/cxadmin/ai-gateway-frontend/deploy.sh
```

每次修改后运行 `./deploy.sh` 即可。