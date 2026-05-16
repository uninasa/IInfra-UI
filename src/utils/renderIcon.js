import { h } from 'vue'
import { NIcon } from 'naive-ui'
import {
  BarChartOutline,
  SettingsOutline,
  PeopleOutline,
  ShieldOutline,
  MenuOutline,
  PulseOutline,
  ServerOutline,
  DocumentTextOutline,
  HomeOutline,
  PersonOutline,
  KeyOutline,
  AppsOutline,
} from '@vicons/ionicons5'

/**
 * 图标名称 → 组件映射表
 * 后端返回的 icon 字段是字符串，需要映射为实际组件
 */
const iconMap = {
  BarChartOutline,
  SettingsOutline,
  PeopleOutline,
  ShieldOutline,
  MenuOutline,
  PulseOutline,
  ServerOutline,
  DocumentTextOutline,
  HomeOutline,
  PersonOutline,
  KeyOutline,
  AppsOutline,
}

/**
 * 渲染图标（供菜单使用）
 * @param {string|Component} icon 图标名称字符串或组件
 * @returns {Function|undefined}
 */
export function renderIcon(icon) {
  if (!icon) return undefined

  // 如果是字符串，从映射表查找
  if (typeof icon === 'string') {
    const comp = iconMap[icon]
    if (!comp) return undefined
    return () => h(NIcon, null, { default: () => h(comp) })
  }

  // 如果是组件，直接渲染
  return () => h(NIcon, null, { default: () => h(icon) })
}
