<template>
  <n-menu
    :collapsed="appStore.collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
    :value="activeKey"
    @update:value="handleMenuSelect"
  />
</template>

<script setup>
import { computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { renderIcon } from '@/utils/renderIcon'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const activeKey = computed(() => route.path)

/**
 * 将权限菜单数据转换为 Naive UI menu options 格式
 */
const menuOptions = computed(() => {
  return buildMenuOptions(permissionStore.permissionList)
})

function buildMenuOptions(menus) {
  if (!menus || menus.length === 0) return []

  return menus
    .filter((item) => !item.meta?.hidden)
    .map((item) => {
      const option = {
        label: item.meta?.title || item.name,
        key: item.path,
        icon: item.meta?.icon ? renderIcon(item.meta.icon) : undefined,
      }

      if (item.children && item.children.length > 0) {
        const children = buildMenuOptions(item.children)
        if (children.length > 0) {
          option.children = children
        }
      }

      return option
    })
}

function handleMenuSelect(key) {
  router.push(key)
}
</script>
