import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { darkTheme } from 'naive-ui'

export const useAppStore = defineStore('app', () => {
  /** 侧边栏折叠状态 */
  const collapsed = ref(false)
  /** 深色模式 */
  const isDark = ref(false)
  /** 标签页列表 */
  const visitedViews = ref([])
  /** 当前激活的标签页 */
  const activeTab = ref('')

  /** Naive UI 主题 */
  const naiveTheme = computed(() => (isDark.value ? darkTheme : null))

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  function toggleDark() {
    isDark.value = !isDark.value
    // 同步 discrete API 的主题
    import('@/utils/discrete').then(({ syncDiscreteTheme }) => {
      syncDiscreteTheme(isDark.value)
    })
  }

  /**
   * 添加标签页
   * @param {{ path: string, title: string, name: string }} route
   */
  function addVisitedView(route) {
    if (visitedViews.value.find((v) => v.path === route.path)) return
    visitedViews.value.push({
      path: route.path,
      title: route.meta?.title || route.name || route.path,
      name: route.name,
      meta: route.meta,
    })
  }

  /**
   * 关闭标签页
   * @param {string} path
   */
  function removeVisitedView(path) {
    const index = visitedViews.value.findIndex((v) => v.path === path)
    if (index > -1) {
      visitedViews.value.splice(index, 1)
    }
  }

  /**
   * 关闭其他标签页
   * @param {string} path 保留的路径
   */
  function removeOtherViews(path) {
    visitedViews.value = visitedViews.value.filter((v) => v.path === path)
  }

  /**
   * 关闭所有标签页
   */
  function removeAllViews() {
    visitedViews.value = []
  }

  function setActiveTab(path) {
    activeTab.value = path
  }

  return {
    collapsed,
    isDark,
    visitedViews,
    activeTab,
    naiveTheme,
    toggleCollapsed,
    toggleDark,
    addVisitedView,
    removeVisitedView,
    removeOtherViews,
    removeAllViews,
    setActiveTab,
  }
})
