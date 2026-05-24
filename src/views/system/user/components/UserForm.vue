<template>
  <n-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-placement="left"
    :label-width="80"
  >
    <n-form-item label="用户名" path="username">
      <n-input
        v-model:value="formData.username"
        placeholder="请输入用户名"
        :disabled="!!formData.id"
      />
    </n-form-item>

    <n-form-item label="头像" path="avatar">
      <n-space vertical style="width: 100%">
        <n-input 
          v-model:value="formData.avatar" 
          placeholder="请输入头像 URL（可选）" 
          clearable
        />
        <n-space align="center">
          <n-avatar 
            :size="60" 
            :src="formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username || 'default'}`"
            fallback-src="https://api.dicebear.com/7.x/avataaars/svg?seed=default"
          />
          <n-text depth="3" style="font-size: 12px">
            预览（留空将使用默认头像）
          </n-text>
        </n-space>
      </n-space>
    </n-form-item>
    
    <n-form-item label="昵称" path="nickname">
      <n-input v-model:value="formData.nickname" placeholder="请输入昵称" />
    </n-form-item>
    
    <n-form-item label="邮箱" path="email">
      <n-input v-model:value="formData.email" placeholder="请输入邮箱" />
    </n-form-item>
    
    <n-form-item label="手机号" path="phone">
      <n-input v-model:value="formData.phone" placeholder="请输入手机号" />
    </n-form-item>
    
    <n-form-item v-if="!formData.id" label="密码" path="password">
      <n-input
        v-model:value="formData.password"
        type="password"
        placeholder="请输入密码"
        show-password-on="click"
      />
    </n-form-item>
    
    <n-form-item label="状态" path="status">
      <n-radio-group v-model:value="formData.status">
        <n-radio :value="1">启用</n-radio>
        <n-radio :value="0">禁用</n-radio>
      </n-radio-group>
    </n-form-item>
  </n-form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const formRef = ref(null)
const formData = reactive({
  id: '',
  username: '',
  nickname: '',
  avatar: '',
  email: '',
  phone: '',
  password: '',
  status: 1,
})

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' },
  ],
}

// 监听外部数据变化
watch(
  () => props.modelValue,
  (val) => {
    Object.assign(formData, val)
  },
  { immediate: true, deep: true }
)

// 监听内部数据变化
watch(
  formData,
  (val) => {
    emit('update:modelValue', val)
  },
  { deep: true }
)

// 验证表单
async function validate() {
  return await formRef.value?.validate()
}

// 重置表单
function reset() {
  formRef.value?.restoreValidation()
}

// 获取表单数据
function getFormData() {
  return { ...formData }
}

// 设置表单数据
function setFormData(data) {
  Object.assign(formData, data)
}

defineExpose({
  validate,
  reset,
  getFormData,
  setFormData,
  formRef,
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
