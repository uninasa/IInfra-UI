import localforage from 'localforage'

// ==================== 存储 Key 常量 ====================
export const ACCESS_TOKEN = 'ACCESS_TOKEN'
export const USER_INFO = 'USER_INFO'
export const USER_AUTH = 'USER_AUTH'
export const SYS_BUTTON_AUTH = 'SYS_BUTTON_AUTH'
export const TENANT_LIST = 'TENANT_LIST'
export const SUB_SYSTEM = 'SUB_SYSTEM'

// ==================== 路由白名单 ====================
export const WHITE_LIST = ['/user/login', '/404', '/403']

// ==================== localforage 封装 ====================
localforage.config({
  name: 'IInfra-UI',
  storeName: 'iinfra_store',
})

export const forage = {
  /**
   * 设置缓存（支持过期时间）
   * @param {string} key
   * @param {*} value
   * @param {number} expire 过期时间（毫秒），不传则永不过期
   */
  async set(key, value, expire) {
    const data = {
      value,
      expire: expire ? Date.now() + expire : null,
    }
    await localforage.setItem(key, data)
  },

  /**
   * 获取缓存
   */
  async get(key) {
    const data = await localforage.getItem(key)
    if (!data) return null
    if (data.expire && Date.now() > data.expire) {
      await localforage.removeItem(key)
      return null
    }
    return data.value
  },

  /**
   * 删除缓存
   */
  async remove(key) {
    await localforage.removeItem(key)
  },

  /**
   * 清空所有缓存
   */
  async clear() {
    await localforage.clear()
  },
}
