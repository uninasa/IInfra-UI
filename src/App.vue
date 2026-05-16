<template>
  <n-config-provider :theme="theme" :locale="zhCN" :date-locale="dateZhCN">
    <router-view />
  </n-config-provider>
</template>

<script setup>
import { computed } from 'vue'
import { zhCN, dateZhCN } from 'naive-ui'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const theme = computed(() => appStore.naiveTheme)
</script>
