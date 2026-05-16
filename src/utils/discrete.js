/**
 * 使用 Naive UI 的 createDiscreteApi 创建独立于组件树的全局 API
 * 采用懒加载单例模式，第一次调用时才初始化，避免模块加载时立即执行导致 Pinia 未就绪崩溃
 * 文档：https://www.naiveui.com/zh-CN/os-theme/components/message#Q-&-A
 */
import { createDiscreteApi, darkTheme, lightTheme } from 'naive-ui'
import { computed, ref } from 'vue'

const isDark = ref(false)

let _api = null

function getApi() {
  if (!_api) {
    const configProviderProps = computed(() => ({
      theme: isDark.value ? darkTheme : lightTheme,
    }))
    _api = createDiscreteApi(
      ['message', 'dialog', 'notification', 'loadingBar'],
      { configProviderProps }
    )
  }
  return _api
}

export const message = new Proxy({}, {
  get(_, key) { return getApi().message[key] },
})

export const dialog = new Proxy({}, {
  get(_, key) { return getApi().dialog[key] },
})

export const notification = new Proxy({}, {
  get(_, key) { return getApi().notification[key] },
})

export const loadingBar = new Proxy({}, {
  get(_, key) { return getApi().loadingBar[key] },
})

/**
 * 同步主题状态（在 app store 切换主题时调用）
 */
export function syncDiscreteTheme(dark) {
  isDark.value = dark
}
