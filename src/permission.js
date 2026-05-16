import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { forage, ACCESS_TOKEN, WHITE_LIST } from '@/config'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false })

/**
 * 通配符兜底路由，必须在所有动态路由 addRoute 之后再添加，
 * 否则会在动态路由加载前就匹配掉所有路径导致直接 404
 */
const notFoundRoute = {
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  meta: { hidden: true },
}

let notFoundAdded = false

/**
 * 初始化全局路由守卫
 * @param {import('vue-router').Router} router
 */
export function setupPermission(router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()

    const token = await forage.get(ACCESS_TOKEN)

    if (token) {
      // ===== 已登录 =====
      if (to.path === '/user/login') {
        next({ path: '/' })
        NProgress.done()
        return
      }

      const permissionStore = usePermissionStore()

      if (!permissionStore.isLoaded) {
        // 权限未加载，先获取权限菜单
        try {
          await permissionStore.getPermissionList()

          // 动态添加业务路由
          permissionStore.addRouters.forEach((route) => {
            router.addRoute(route)
          })

          // 业务路由全部加载完后，再追加通配符兜底，保证顺序正确
          if (!notFoundAdded) {
            router.addRoute(notFoundRoute)
            notFoundAdded = true
          }

          // 重新导航到目标路由
          next({ ...to, replace: true })
        } catch (error) {
          console.error('[Permission] 获取权限失败:', error)
          const userStore = useUserStore()
          await userStore.clearAuth()
          next({ path: '/user/login', query: { redirect: to.fullPath } })
        }
      } else {
        next()
      }
    } else {
      // ===== 未登录 =====

      // 确保未登录时也有兜底路由（防止直接访问不存在的路径空白）
      if (!notFoundAdded) {
        router.addRoute(notFoundRoute)
        notFoundAdded = true
      }

      if (WHITE_LIST.includes(to.path)) {
        next()
      } else {
        next({
          path: '/user/login',
          query: { redirect: to.fullPath },
        })
      }
    }
  })

  router.afterEach(() => {
    NProgress.done()
  })
}
