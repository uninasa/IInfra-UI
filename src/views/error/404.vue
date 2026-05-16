<template>
  <div class="error-page">
    <n-result status="404" title="404" description="页面不存在">
      <template #footer>
        <n-button type="primary" @click="router.push('/')">返回首页</n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
