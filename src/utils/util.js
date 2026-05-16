import { shallowRef } from 'vue'
import { RouterView } from 'vue-router'
import TabLayout from '@/layouts/TabLayout.vue'

/**
 * 生成顶层路由（动态路由入口）
 * @param {Array} data 后端返回的菜单数据
 * @returns {Array} 路由配置数组
 */
export function generateIndexRouter(data) {
  const indexRouter = {
    path: '/',
    name: 'dashboard',
    component: shallowRef(TabLayout),
    meta: { title: '首页' },
    redirect: '/dashboard',
    children: [...generateChildRouters(data)],
  }
  return [
    indexRouter,
    ...generateFullPageRouters(data),
  ]
}

/**
 * 递归生成子路由
 * @param {Array} data 菜单数据
 * @returns {Array} 子路由配置
 */
export function generateChildRouters(data) {
  const routers = []

  for (const item of data) {
    // 跳过全屏页面（在 generateFullPageRouters 中处理）
    if (item.meta?.fullPage) continue

    const route = {
      path: item.path,
      name: item.name,
      meta: {
        title: item.meta?.title || item.name,
        icon: item.meta?.icon || '',
        keepAlive: item.meta?.keepAlive || false,
        permissionList: item.meta?.permissionList || [],
        hidden: item.meta?.hidden || false,
      },
    }

    // 设置组件
    if (item.component) {
      route.component = resolveComponent(item.component)
    }

    // 递归处理子路由
    if (item.children && item.children.length > 0) {
      route.children = generateChildRouters(item.children)
      // 有子路由的目录节点，默认重定向到第一个子路由
      if (!route.redirect && route.children.length > 0) {
        route.redirect = route.children[0].path
      }
    }

    routers.push(route)
  }

  return routers
}

/**
 * 生成全屏页面路由（不在主布局内）
 * @param {Array} data 菜单数据
 * @returns {Array} 全屏路由配置
 */
export function generateFullPageRouters(data) {
  const routers = []

  for (const item of data) {
    if (item.meta?.fullPage) {
      routers.push({
        path: item.path,
        name: item.name,
        component: resolveComponent(item.component),
        meta: item.meta,
      })
    }
    if (item.children && item.children.length > 0) {
      routers.push(...generateFullPageRouters(item.children))
    }
  }

  return routers
}

/**
 * 解析组件路径
 * 解决 Vite 动态引入 Glob 只能深入一层的问题
 * 预设10级动态引入深度
 * @param {string} component 组件路径（相对于 views 目录）
 * @returns {Function} 动态导入函数
 */
export function resolveComponent(component) {
  if (!component) return null

  // 处理 Layout 特殊组件 — 作为子路由的目录节点，用 RouterView 透传
  if (component === 'Layout' || component === 'TabLayout') {
    return shallowRef(RouterView)
  }

  const tmp = component.split('/')

  switch (tmp.length) {
    case 1:
      return () => import(`@/views/${tmp[0]}.vue`)
    case 2:
      return () => import(`@/views/${tmp[0]}/${tmp[1]}.vue`)
    case 3:
      return () => import(`@/views/${tmp[0]}/${tmp[1]}/${tmp[2]}.vue`)
    case 4:
      return () => import(`@/views/${tmp[0]}/${tmp[1]}/${tmp[2]}/${tmp[3]}.vue`)
    case 5:
      return () => import(`@/views/${tmp[0]}/${tmp[1]}/${tmp[2]}/${tmp[3]}/${tmp[4]}.vue`)
    case 6:
      return () => import(`@/views/${tmp[0]}/${tmp[1]}/${tmp[2]}/${tmp[3]}/${tmp[4]}/${tmp[5]}.vue`)
    case 7:
      return () => import(`@/views/${tmp[0]}/${tmp[1]}/${tmp[2]}/${tmp[3]}/${tmp[4]}/${tmp[5]}/${tmp[6]}.vue`)
    case 8:
      return () => import(`@/views/${tmp[0]}/${tmp[1]}/${tmp[2]}/${tmp[3]}/${tmp[4]}/${tmp[5]}/${tmp[6]}/${tmp[7]}.vue`)
    case 9:
      return () => import(`@/views/${tmp[0]}/${tmp[1]}/${tmp[2]}/${tmp[3]}/${tmp[4]}/${tmp[5]}/${tmp[6]}/${tmp[7]}/${tmp[8]}.vue`)
    case 10:
      return () => import(`@/views/${tmp[0]}/${tmp[1]}/${tmp[2]}/${tmp[3]}/${tmp[4]}/${tmp[5]}/${tmp[6]}/${tmp[7]}/${tmp[8]}/${tmp[9]}.vue`)
    default:
      console.warn(`[Router] 组件路径层级超过10层，不支持: ${component}`)
      return () => import('@/views/error/404.vue')
  }
}
