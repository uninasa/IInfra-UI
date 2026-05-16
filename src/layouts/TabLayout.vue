<template>
  <n-layout class="layout-container" has-sider>
    <!-- 侧边栏 -->
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="220"
      :collapsed="appStore.collapsed"
      show-trigger
      @collapse="appStore.collapsed = true"
      @expand="appStore.collapsed = false"
    >
      <!-- Logo -->
      <div class="logo" :class="{ 'logo--collapsed': appStore.collapsed }">
        <img src="/favicon.svg" alt="logo" class="logo__img" />
        <span v-if="!appStore.collapsed" class="logo__title">IInfra UI</span>
      </div>

      <!-- 菜单 -->
      <SideMenu />
    </n-layout-sider>

    <n-layout>
      <!-- 顶部导航 -->
      <n-layout-header bordered class="header">
        <HeaderBar />
      </n-layout-header>

      <!-- 标签页 -->
      <div class="tabs-bar">
        <TabsBar />
      </div>

      <!-- 主内容区 -->
      <n-layout-content class="main-content">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
          </transition>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import SideMenu from '@/components/layout/SideMenu.vue'
import HeaderBar from '@/components/layout/HeaderBar.vue'
import TabsBar from '@/components/layout/TabsBar.vue'

const appStore = useAppStore()

const cachedViews = computed(() =>
  appStore.visitedViews
    .filter((v) => v.meta?.keepAlive)
    .map((v) => v.name)
)
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  height: 64px;
  overflow: hidden;
  cursor: pointer;
  transition: padding 0.3s;
}

.logo--collapsed {
  padding: 16px 20px;
  justify-content: center;
}

.logo__img {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo__title {
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  color: var(--n-text-color);
}

.header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.tabs-bar {
  border-bottom: 1px solid var(--n-border-color);
  background: var(--n-color);
}

.main-content {
  padding: 16px;
  overflow-y: auto;
  height: calc(100vh - 64px - 40px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
