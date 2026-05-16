<template>
  <div class="header-bar">
    <!-- 左侧：面包屑 -->
    <n-breadcrumb class="breadcrumb">
      <n-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
        {{ item.title }}
      </n-breadcrumb-item>
    </n-breadcrumb>

    <!-- 右侧：操作区 -->
    <div class="header-actions">
      <!-- 深色模式切换 -->
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button quaternary circle @click="appStore.toggleDark()">
            <template #icon>
              <n-icon :component="appStore.isDark ? SunnyOutline : MoonOutline" />
            </template>
          </n-button>
        </template>
        {{ appStore.isDark ? '切换亮色' : '切换暗色' }}
      </n-tooltip>

      <!-- 用户信息 -->
      <n-dropdown :options="userMenuOptions" @select="handleUserAction">
        <div class="user-info">
          <n-avatar round size="small" :src="userStore.userInfo?.avatar">
            {{ userStore.userInfo?.realname?.charAt(0) || 'U' }}
          </n-avatar>
          <span class="username">{{ userStore.userInfo?.realname || userStore.userInfo?.username }}</span>
        </div>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { SunnyOutline, MoonOutline, LogOutOutline, PersonOutline } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

// 面包屑
const breadcrumbs = computed(() => {
  return route.matched
    .filter((item) => item.meta?.title)
    .map((item) => ({ path: item.path, title: item.meta.title }))
})

// 用户下拉菜单
const userMenuOptions = [
  {
    label: '个人中心',
    key: 'profile',
    icon: () => h(NIcon, null, { default: () => h(PersonOutline) }),
  },
  { type: 'divider' },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h(NIcon, null, { default: () => h(LogOutOutline) }),
  },
]

async function handleUserAction(key) {
  if (key === 'logout') {
    await userStore.logout()
    permissionStore.resetPermission()
    router.push('/user/login')
  } else if (key === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.breadcrumb {
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.user-info:hover {
  background: var(--n-button-color-hover);
}

.username {
  font-size: 14px;
}
</style>
