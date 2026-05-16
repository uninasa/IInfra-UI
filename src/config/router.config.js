/**
 * 静态路由配置
 * 不需要权限即可访问的路由
 * 注意：通配符兜底路由不在这里配置，在动态路由加载完成后由 permission.js 添加
 */
export const constantRouterMap = [
  {
    path: '/user/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403.vue'),
    meta: { title: '403', hidden: true },
  },
]
