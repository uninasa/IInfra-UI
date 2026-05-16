import { USER_AUTH, SYS_BUTTON_AUTH } from '@/config'

/**
 * 初始化权限映射表
 * @returns {Object} 权限 Map，key 为 action 标识
 */
export function initAuthMap() {
  const allAuthList = JSON.parse(sessionStorage.getItem(USER_AUTH) || '[]')
  const authMap = {}
  allAuthList
    .filter((item) => item.type === '1') // 只取按钮权限
    .forEach((item) => {
      authMap[item.action] = item
    })
  return authMap
}

/**
 * 初始化流程节点权限映射表
 * @returns {Object}
 */
export function initNodeAuthMap() {
  const nodeAuthList = JSON.parse(sessionStorage.getItem(SYS_BUTTON_AUTH) || '[]')
  const nodeAuthMap = {}
  nodeAuthList.forEach((item) => {
    nodeAuthMap[item.action] = item
  })
  return nodeAuthMap
}

/**
 * 全局权限过滤（检查全局权限列表）
 * @param {HTMLElement} el
 * @param {Object} binding
 */
export function filterGlobalPermission(el, binding) {
  const authMap = initAuthMap()
  const permissions = binding.value.split(',').map((p) => p.trim())

  for (let i = 0; i < permissions.length; i++) {
    if (Object.prototype.hasOwnProperty.call(authMap, permissions[i])) {
      return // 有权限，直接返回，保留元素
    }
  }

  // 没有权限，移除 DOM 元素
  el.parentNode && el.parentNode.removeChild(el)
}

/**
 * 流程节点权限过滤
 * @param {HTMLElement} el
 * @param {Object} binding
 * @param {Object} vNode
 * @returns {boolean} 是否命中节点权限
 */
export function filterNodePermission(el, binding, vNode) {
  const nodeAuthMap = initNodeAuthMap()
  const permissions = binding.value.split(',').map((p) => p.trim())

  for (let i = 0; i < permissions.length; i++) {
    if (Object.prototype.hasOwnProperty.call(nodeAuthMap, permissions[i])) {
      return true // 命中节点权限
    }
  }
  return false
}

/**
 * v-has 指令定义
 */
export const hasDirective = {
  mounted(el, binding, vNode) {
    if (!binding.value) return
    // 1. 优先检查流程节点权限
    if (!filterNodePermission(el, binding, vNode)) {
      // 2. 检查全局权限
      filterGlobalPermission(el, binding, vNode)
    }
  },
}
