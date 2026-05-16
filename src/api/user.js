import { postAction, getAction } from '@/utils/request'

/**
 * 登录
 */
export function login(data) {
  return postAction('/v1/sys/login', data)
}

/**
 * 退出登录
 */
export function logout() {
  return postAction('/v1/sys/logout')
}

/**
 * 获取用户权限菜单
 */
export function queryPermissionsByUser() {
  return getAction('/v1/sys/permission/queryPermissionsByUser')
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return getAction('/v1/sys/user/info')
}
