import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  forage,
  ACCESS_TOKEN,
  USER_INFO,
  USER_AUTH,
  SYS_BUTTON_AUTH,
  TENANT_LIST,
  SUB_SYSTEM,
} from '@/config'
import { postAction, getAction } from '@/utils/request'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref({})
  const permissions = ref([])
  const roles = ref([])
  const tenantList = ref([])

  /**
   * 登录
   * @param {Object} loginForm { username, password, tenantId? }
   */
  async function login(loginForm) {
    const res = await postAction('/v1/sys/login', loginForm)
    const result = res.result

    // 存储 Token（7天有效期）
    const expire = 7 * 24 * 60 * 60 * 1000
    await forage.set(ACCESS_TOKEN, result.token, expire)
    await forage.set(USER_INFO, result.userInfo, expire)

    token.value = result.token
    userInfo.value = result.userInfo

    // 存储租户信息
    if (result.tenantList) {
      tenantList.value = result.tenantList
      localStorage.setItem(TENANT_LIST, JSON.stringify(result.tenantList))
    }
    if (result.subSystem !== undefined) {
      localStorage.setItem(SUB_SYSTEM, result.subSystem)
    }

    return result
  }

  /**
   * 退出登录
   */
  async function logout() {
    try {
      await postAction('/v1/sys/logout')
    } catch (e) {
      // 忽略退出接口错误
    }
    await clearAuth()
  }

  /**
   * 清除认证信息
   */
  async function clearAuth() {
    token.value = ''
    userInfo.value = {}
    permissions.value = []
    roles.value = []
    await forage.clear()
    sessionStorage.clear()
  }

  /**
   * 从本地存储恢复 Token
   */
  async function restoreToken() {
    const savedToken = await forage.get(ACCESS_TOKEN)
    const savedUserInfo = await forage.get(USER_INFO)
    if (savedToken) {
      token.value = savedToken
      userInfo.value = savedUserInfo || {}
    }
    return savedToken
  }

  /**
   * 设置权限列表（由 permission store 调用）
   */
  function setPermissions(perms) {
    permissions.value = perms
  }

  function setRoles(roleList) {
    roles.value = roleList
  }

  return {
    token,
    userInfo,
    permissions,
    roles,
    tenantList,
    login,
    logout,
    clearAuth,
    restoreToken,
    setPermissions,
    setRoles,
  }
})
