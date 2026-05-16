import { useUserStore } from '@/store/modules/user'

/**
 * 验证单个权限
 * @param {string} permission 权限标识
 * @returns {boolean}
 */
function authPermission(permission) {
  const userStore = useUserStore()
  const permissions = userStore.permissions
  return permissions.some((v) => v === permission || v === '*:*:*')
}

/**
 * 验证单个角色
 * @param {string} role 角色标识
 * @returns {boolean}
 */
function authRole(role) {
  const userStore = useUserStore()
  const roles = userStore.roles
  return roles.some((v) => v === role || v === 'admin')
}

const auth = {
  /**
   * 验证单个权限
   */
  hasPermi(permission) {
    return authPermission(permission)
  },

  /**
   * 验证多个权限（或关系，满足其一即可）
   * @param {string[]} permissions
   */
  hasPermiOr(permissions) {
    return permissions.some((item) => authPermission(item))
  },

  /**
   * 验证多个权限（且关系，全部满足）
   * @param {string[]} permissions
   */
  hasPermiAnd(permissions) {
    return permissions.every((item) => authPermission(item))
  },

  /**
   * 验证单个角色
   */
  hasRole(role) {
    return authRole(role)
  },

  /**
   * 验证多个角色（或关系）
   * @param {string[]} roles
   */
  hasRoleOr(roles) {
    return roles.some((item) => authRole(item))
  },

  /**
   * 验证多个角色（且关系）
   * @param {string[]} roles
   */
  hasRoleAnd(roles) {
    return roles.every((item) => authRole(item))
  },
}

export default auth
