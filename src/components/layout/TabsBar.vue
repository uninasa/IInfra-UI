<template>
  <div class="tabs-bar">
    <n-scrollbar x-scrollable style="max-width: 100%">
      <div class="tabs-list">
        <div
          v-for="tab in appStore.visitedViews"
          :key="tab.path"
          class="tab-item"
          :class="{ 'tab-item--active': tab.path === route.path }"
          @click="handleTabClick(tab)"
        >
          <span class="tab-title">{{ tab.title }}</span>
          <n-icon
            class="tab-close"
            size="12"
            :component="CloseOutline"
            @click.stop="handleTabClose(tab)"
          />
        </div>
      </div>
    </n-scrollbar>

    <!-- 右键菜单 -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="contextMenuX"
      :y="contextMenuY"
      :options="contextMenuOptions"
      :show="showContextMenu"
      @clickoutside="showContextMenu = false"
      @select="handleContextMenu"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { CloseOutline } from '@vicons/ionicons5'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 监听路由变化，自动添加标签页
watch(
  () => route.path,
  () => {
    if (route.meta?.title && !route.meta?.hidden) {
      appStore.addVisitedView(route)
      appStore.setActiveTab(route.path)
    }
  },
  { immediate: true }
)

function handleTabClick(tab) {
  router.push(tab.path)
}

function handleTabClose(tab) {
  const views = appStore.visitedViews
  const index = views.findIndex((v) => v.path === tab.path)
  appStore.removeVisitedView(tab.path)

  // 如果关闭的是当前激活的标签，跳转到相邻标签
  if (tab.path === route.path) {
    const nextTab = views[index + 1] || views[index - 1]
    if (nextTab) {
      router.push(nextTab.path)
    } else {
      router.push('/')
    }
  }
}

// 右键菜单
const showContextMenu = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const contextMenuTarget = ref(null)

const contextMenuOptions = [
  { label: '关闭其他', key: 'closeOthers' },
  { label: '关闭所有', key: 'closeAll' },
]

function handleContextMenu(key) {
  showContextMenu.value = false
  if (key === 'closeOthers') {
    appStore.removeOtherViews(contextMenuTarget.value?.path)
  } else if (key === 'closeAll') {
    appStore.removeAllViews()
    router.push('/')
  }
}
</script>

<style scoped>
.tabs-bar {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 8px;
}

.tabs-list {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  white-space: nowrap;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  border: 1px solid transparent;
  transition: all 0.2s;
  user-select: none;
}

.tab-item:hover {
  background: var(--n-button-color-hover);
}

.tab-item--active {
  background: var(--n-primary-color-suppl);
  border-color: var(--n-primary-color);
  color: var(--n-primary-color);
}

.tab-close {
  opacity: 0.5;
  transition: opacity 0.2s;
}

.tab-close:hover {
  opacity: 1;
}
</style>
