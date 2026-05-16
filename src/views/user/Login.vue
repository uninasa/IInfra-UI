<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Logo & 标题 -->
      <div class="login-header">
        <img src="/favicon.svg" alt="logo" class="login-logo" />
        <h1 class="login-title">IInfra UI</h1>
        <p class="login-subtitle">企业级管理系统</p>
      </div>

      <!-- 登录表单 -->
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        size="large"
        @keyup.enter="handleLogin"
      >
        <n-form-item path="username" label="用户名">
          <n-input
            v-model:value="formData.username"
            placeholder="请输入用户名"
            clearable
          >
            <template #prefix>
              <n-icon :component="PersonOutline" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password-on="click"
            clearable
          >
            <template #prefix>
              <n-icon :component="LockClosedOutline" />
            </template>
          </n-input>
        </n-form-item>

        <n-button
          type="primary"
          block
          :loading="loading"
          @click="handleLogin"
        >
          登 录
        </n-button>
      </n-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5'
import { useUserStore } from '@/store/modules/user'
import { message } from '@/utils/discrete'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)

const formData = reactive({
  username: 'admin',
  password: '123456',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    await userStore.login(formData)
    message.success('登录成功')

    const redirect = route.query.redirect
    router.push(redirect ? decodeURIComponent(redirect) : '/')
  } catch (error) {
    message.error(error.message || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  padding: 40px;
  background: var(--n-color);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 12px;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px;
}

.login-subtitle {
  font-size: 14px;
  color: var(--n-text-color-3);
  margin: 0;
}
</style>
