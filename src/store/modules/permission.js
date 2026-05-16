import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAction } from '@/utils/request'
import { generateIndexRouter } from '@/utils/util'
import { USER_AUTH, SYS_BUTTON_AUTH } from '@/config'
import { useUserStore } from './user'

export const usePermissionStore = defineStore('permission', () => {
  /** 后端返回的菜单列表 */
  const permissionList = ref([])
  /** 动态生成的路由 */
  const addRouters = ref([])
  /** 是否已加载权限 */
  const isLoaded = ref(false)

  /**
   * 获取用户权限菜单
   * 对应后端接口：GET /api/queryPermissionsByUser
   */
  async function getPermissionList() {
    const res = await getAction('/v1/sys/permission/queryPermissionsByUser')
    const result = res.result

    const menuData = result.menu || []
    const authData = result.auth || []
    const allAuthData = result.allAuth || []

    // 存储按钮权限到 sessionStorage（供 v-has 指令使用）
    sessionStorage.setItem(USER_AUTH, JSON.stringify(authData))
    sessionStorage.setItem(SYS_BUTTON_AUTH, JSON.stringify(allAuthData))

    // 提取权限标识列表，供编程式权限判断使用
    const userStore = useUserStore()
    const perms = authData.map((item) => item.action)
    userStore.setPermissions(perms)

    // 存储菜单数据
    permissionList.value = menuData

    // 生成动态路由
    const constRoutes = generateIndexRouter(menuData)
    addRouters.value = constRoutes
    isLoaded.value = true

    return result
  }

  /**
   * 更新路由（外部调用）
   */
  function updateAppRouter(routes) {
    addRouters.value = routes
    isLoaded.value = true
  }

  /**
   * 重置权限（退出登录时调用）
   */
  function resetPermission() {
    permissionList.value = []
    addRouters.value = []
    isLoaded.value = false
  }

  return {
    permissionList,
    addRouters,
    isLoaded,
    getPermissionList,
    updateAppRouter,
    resetPermission,
  }
})
