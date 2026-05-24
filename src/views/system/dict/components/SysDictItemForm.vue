<template>
  <n-form
    ref="formRef"
    :model="modelValue"
    :rules="rules"
    label-placement="left"
    label-width="80"
  >
    <n-form-item label="名称" path="itemText">
      <n-input
        v-model:value="modelValue.itemText"
        placeholder="请输入名称"
        clearable
      />
    </n-form-item>
    <n-form-item label="数据值" path="itemValue">
      <n-input
        v-model:value="modelValue.itemValue"
        placeholder="请输入数据值"
        clearable
      />
    </n-form-item>
    <n-form-item label="排序" path="sortOrder">
      <n-input-number
        v-model:value="modelValue.sortOrder"
        placeholder="请输入排序"
        :min="0"
        style="width: 100%"
      />
    </n-form-item>
    <n-form-item label="状态" path="status">
      <n-radio-group v-model:value="modelValue.status">
        <n-radio :value="1">启用</n-radio>
        <n-radio :value="0">禁用</n-radio>
      </n-radio-group>
    </n-form-item>
    <n-form-item label="备注" path="remark">
      <n-input
        v-model:value="modelValue.remark"
        type="textarea"
        placeholder="请输入备注"
        :rows="3"
        clearable
      />
    </n-form-item>
  </n-form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const formRef = ref(null)

// 表单验证规则
const rules = {
  itemText: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  itemValue: [
    { required: true, message: '请输入数据值', trigger: 'blur' },
  ],
}

// 验证表单
async function validate() {
  return await formRef.value?.validate()
}

// 重置表单
function reset() {
  formRef.value?.restoreValidation()
}

// 暴露方法
defineExpose({
  validate,
  reset,
})
</script>
