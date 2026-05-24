import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { forage, ACCESS_TOKEN, WHITE_LIST } from '@/config'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false })


/**
 * 初始化全局路由守卫
 * @param {import('vue-router').Router} router
 */
export function setupPermission(router) {
  router.beforeEach(async (to, _from, next) => {
    // 启动进度条
    NProgress.start()
    // 获取令牌并加载权限
    await resolveNavigation(to, next, router)
  })

  router.afterEach(() => {
    // 结束进度条
    NProgress.done()
  })
}


/**
 * 根据登录状态决定路由跳转行为
 * - 有 token：加载权限并跳转目标页
 * - 无 token：白名单放行，否则重定向登录页
 */
async function resolveNavigation(to, next, router) {
  // 读取本地 token
  const token = await forage.get(ACCESS_TOKEN)

  if (token) {
    // 已登录：加载权限菜单，跳转目标页
    await handleAuthenticated(to, next, router)
  } else {
    // 未登录：白名单放行或重定向登录页
    handleUnauthenticated(to, next, router)
  }
}

/**
 * 处理已登录状态下的路由跳转
 * - 访问登录页时直接跳首页（避免重复登录）
 * - 权限已加载时直接放行
 * - 权限未加载时拉取菜单并动态注册路由，成功后重新导航；失败则清除登录态跳回登录页
 */
async function handleAuthenticated(to, next, router) {
  // 已登录时访问登录页，跳转首页
  if (to.path === '/user/login') {
    next({ path: '/' })
    return
  }

  const permissionStore = usePermissionStore()

  // 权限已加载，直接放行
  if (permissionStore.isLoaded) {
    next()
    return
  }

  try {
    // 拉取权限菜单并动态注册路由
    await loadPermissionAndRoutes(router)
    // 重新导航到目标路由（replace 避免产生多余历史记录）
    next({ ...to, replace: true })
  } catch (error) {
    console.error('[Permission] 获取权限失败:', error)
    // 清除登录态，重新登录
    const userStore = useUserStore()
    await userStore.clearAuth()
    next({ path: '/user/login', query: { redirect: to.fullPath } })
  }
}

/**
 * 处理未登录状态下的路由跳转
 * - 确保兜底路由已注册（防止未知路径页面空白）
 * - 白名单路径直接放行，其余跳转登录页并携带 redirect 参数
 */
function handleUnauthenticated(to, next, router) {
  // 注册兜底路由，防止未知路径页面空白
  ensureNotFoundRoute(router)

  if (WHITE_LIST.includes(to.path)) {
    // 白名单路径，直接放行
    next()
  } else {
    // 未登录且不在白名单，跳转登录页
    next({ path: '/user/login', query: { redirect: to.fullPath } })
  }
}

/**
 * 拉取权限菜单，并将动态路由注册到 router
 * 兜底路由必须在所有动态路由注册完成后追加，否则会提前匹配所有路径导致直接 404
 */
async function loadPermissionAndRoutes(router) {
  const permissionStore = usePermissionStore()
  // 请求后端菜单接口，生成动态路由
  await permissionStore.getPermissionList()
  // 将动态路由逐一注册到 router
  permissionStore.addRouters.forEach((route) => router.addRoute(route))
  // 所有动态路由注册完毕后，追加通配符兜底路由
  ensureNotFoundRoute(router)
}

/**
 * 注册通配符兜底路由（幂等，只注册一次）
 * 路径 /:pathMatch(.*)*  →  重定向 /404
 */
let notFoundAdded = false

function ensureNotFoundRoute(router) {
  if (notFoundAdded) return
  router.addRoute({
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true },
  })
  notFoundAdded = true
}
