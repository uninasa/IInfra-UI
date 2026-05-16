import { hasDirective } from '@/utils/hasPermission'

/**
 * 注册全局自定义指令
 * @param {import('vue').App} app
 */
export function setupDirectives(app) {
  // v-has: 按钮级权限控制
  app.directive('has', hasDirective)
}
