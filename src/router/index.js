import { createRouter, createWebHistory } from 'vue-router'
import { constantRouterMap } from '@/config/router.config'

let router = null

export function setupRouter(app) {
  router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: constantRouterMap,
    scrollBehavior: () => ({ left: 0, top: 0 }),
  })

  app.use(router)
  return router
}

export function getRouter() {
  return router
}

export default router
