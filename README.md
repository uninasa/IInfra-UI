# IInfra UI

企业级动态路由 + 细粒度权限控制管理系统前端框架，基于 Vue 3 + Vite 5 + Naive UI 构建。

## ✨ 特性

- **动态路由** — 根据后端返回的菜单数据自动生成路由，支持最多 10 级目录深度
- **三级权限控制** — 路由级 / 按钮级（`v-has` 指令）/ 数据级权限
- **多租户支持** — 原生支持多租户、多应用系统切换
- **标签页导航** — 多标签页 + KeepAlive 缓存，提升操作效率
- **暗色模式** — 一键切换亮色/暗色主题
- **Mock 数据** — 开发环境内置完整 Mock，无需后端即可运行
- **TypeSafe 请求** — Axios 封装，自动注入 Token，统一错误处理

## 🛠️ 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3 (Composition API) | ^3.4 |
| 构建 | Vite | ^5.0 |
| UI 组件库 | Naive UI | ^2.38 |
| 状态管理 | Pinia | ^2.1 |
| 路由 | Vue Router | ^4.3 |
| HTTP | Axios | ^1.6 |
| 持久化存储 | localforage | ^1.10 |
| 进度条 | NProgress | ^0.2 |
| 图标 | @vicons/ionicons5 | ^0.12 |
| Mock | vite-plugin-mock + mockjs | ^3.0 |

## 📁 项目结构

```
src/
├── api/                    # 接口定义
├── components/
│   └── layout/             # 布局组件（侧边栏、顶栏、标签页）
├── config/
│   ├── index.js            # 常量 + localforage 封装
│   └── router.config.js    # 静态路由配置
├── directives/             # 自定义指令（v-has）
├── layouts/
│   └── TabLayout.vue       # 主布局（侧边栏 + 标签页 + 内容区）
├── plugins/
│   └── auth.js             # 编程式权限判断工具
├── router/                 # Vue Router 初始化
├── store/modules/
│   ├── app.js              # 应用状态（主题、侧边栏、标签页）
│   ├── permission.js       # 权限菜单 + 动态路由生成
│   └── user.js             # 用户认证 + Token 管理
├── styles/                 # 全局样式
├── utils/
│   ├── discrete.js         # Naive UI 全局 API（懒加载单例）
│   ├── hasPermission.js    # v-has 指令核心逻辑
│   ├── request.js          # Axios 封装
│   ├── renderIcon.js       # 图标渲染工具
│   └── util.js             # 动态路由生成器
├── views/                  # 页面视图
├── App.vue                 # 根组件
├── main.js                 # 入口
└── permission.js           # 全局路由守卫
mock/                       # Mock 数据
├── user.js                 # 登录/退出
├── permission.js           # 动态菜单 + 权限
├── system.js               # 用户/角色/菜单 CRUD
└── monitor.js              # 服务器监控/操作日志
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18（推荐 20 LTS）
- npm >= 9

### 安装与运行

```bash
# 克隆项目
git clone <your-repo-url>
cd IInfra-UI

# 安装依赖
npm install

# 启动开发服务器（内置 Mock，无需后端）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 默认账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | 123456 | 超级管理员（全部权限） |
| test | 123456 | 测试用户（部分权限） |

## 🏗️ 核心架构

### 动态路由流程

```
用户登录 → 获取 Token
    ↓
访问页面 → 路由守卫拦截
    ↓
调用 getPermissionList() → 后端返回菜单 + 权限数据
    ↓
generateIndexRouter() → 递归生成路由配置
    ↓
router.addRoute() → 动态注册路由
    ↓
追加 404 兜底路由 → 导航到目标页面
```

### 权限控制

**指令式（模板中使用）：**

```vue
<!-- 单个权限 -->
<n-button v-has="'user:add'">新增</n-button>

<!-- 多个权限（满足其一即显示） -->
<n-button v-has="'user:edit,user:update'">编辑</n-button>
```

**编程式（JS 中使用）：**

```js
import auth from '@/plugins/auth'

if (auth.hasPermi('user:delete')) {
  // 有删除权限
}

if (auth.hasPermiAnd(['order:edit', 'order:approve'])) {
  // 同时拥有编辑和审批权限
}
```

### 全局消息提示

项目使用 `createDiscreteApi` 懒加载单例模式，在任何地方都可以直接使用：

```js
import { message, dialog, notification } from '@/utils/discrete'

message.success('操作成功')
dialog.warning({ title: '确认', content: '确定删除？' })
```

## 📡 后端接口约定

### 登录

```
POST /api/v1/sys/login
Body: { username, password }
Response: { code: "200", result: { token, userInfo, tenantList, subSystem } }
```

### 获取权限菜单

```
GET /api/v1/sys/permission/queryPermissionsByUser
Response: { code: "200", result: { menu: [...], auth: [...], allAuth: [...] } }
```

菜单数据结构：

```json
{
  "path": "/system/user",
  "name": "SystemUser",
  "component": "system/user/index",
  "meta": {
    "title": "用户管理",
    "icon": "PeopleOutline",
    "keepAlive": true,
    "permissionList": [{ "action": "user:add" }]
  },
  "children": []
}
```

## 📦 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_APP_TITLE` | 应用标题 | IInfra UI |
| `VITE_API_BASE_URL` | API 基础路径 | /api |

## 🤝 开发规范

- 状态管理使用 Pinia Composition API 风格
- 全局消息/弹窗统一使用 `@/utils/discrete` 导出的实例，不使用 `useMessage()` 等 composable
- 按钮权限使用 `v-has` 指令，编程式判断使用 `@/plugins/auth`
- 组件路径约定：`views/` 下的目录结构对应后端返回的 `component` 字段

## 📄 License

Copyright 2024 IInfra UI Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
