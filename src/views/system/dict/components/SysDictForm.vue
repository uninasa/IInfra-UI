<template>
  <n-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-placement="left"
      :label-width="80"
  >
    <n-form-item label="字典名词" path="dictName">
      <n-input
          v-model:value="formData.dictName"
          placeholder="请输入字典名词"
          clearable
      />
    </n-form-item>

    <n-form-item label="字典编码" path="dictCode">
      <n-input
          v-model:value="formData.dictCode"
          placeholder="请输入字典编码"
          clearable
      />
    </n-form-item>

    <n-form-item label="描述" path="description">
      <n-input
          v-model:value="formData.description"
          placeholder="请输入描述"
          clearable
      />
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
  dictName: '',
  dictCode: '',
  description: '',
})

// 表单验证规则
const formRules = {
  // 根据实际业务需求添加验证规则
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
