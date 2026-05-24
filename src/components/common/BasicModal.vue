<template>
  <n-modal
    v-model:show="visible"
    :title="title"
    preset="card"
    :style="{ width: modalWidth }"
    :mask-closable="maskClosable"
    @after-leave="handleAfterLeave"
  >
    <n-spin :show="loading">
      <slot name="default" :form-data="formData" :form-ref="formRef">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          :label-placement="labelPlacement"
          :label-width="labelWidth"
        >
          <slot name="form" :form-data="formData" />
        </n-form>
      </slot>
    </n-spin>

    <template #footer>
      <slot name="footer" :loading="loading" :submit="handleSubmit" :cancel="handleCancel">
        <n-space justify="end">
          <n-button @click="handleCancel">{{ cancelText }}</n-button>
          <n-button
            v-if="!readonly"
            type="primary"
            :loading="loading"
            @click="handleSubmit"
          >
            {{ okText }}
          </n-button>
        </n-space>
      </slot>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'

const props = defineProps({
  // 是否显示
  show: {
    type: Boolean,
    default: false,
  },
  // 标题
  title: {
    type: String,
    default: '',
  },
  // 宽度
  width: {
    type: [String, Number],
    default: 520,
  },
  // 表单数据
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  // 表单验证规则
  rules: {
    type: Object,
    default: () => ({}),
  },
  // 提交函数
  onSubmit: {
    type: Function,
    default: null,
  },
  // 标签位置
  labelPlacement: {
    type: String,
    default: 'left',
  },
  // 标签宽度
  labelWidth: {
    type: [String, Number],
    default: 80,
  },
  // 是否只读
  readonly: {
    type: Boolean,
    default: false,
  },
  // 确定按钮文本
  okText: {
    type: String,
    default: '确定',
  },
  // 取消按钮文本
  cancelText: {
    type: String,
    default: '取消',
  },
  // 点击遮罩是否关闭
  maskClosable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:show', 'update:modelValue', 'submit', 'cancel', 'close'])

const visible = ref(props.show)
const loading = ref(false)
const formRef = ref(null)
const formData = reactive({ ...props.modelValue })

const modalWidth = typeof props.width === 'number' ? `${props.width}px` : props.width

// 监听显示状态
watch(
  () => props.show,
  (val) => {
    visible.value = val
  }
)

watch(visible, (val) => {
  emit('update:show', val)
})

// 监听表单数据
watch(
  () => props.modelValue,
  (val) => {
    Object.assign(formData, val)
  },
  { deep: true }
)

// 提交
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    
    loading.value = true
    
    if (props.onSubmit) {
      await props.onSubmit(formData)
    }
    
    emit('submit', formData)
    emit('update:modelValue', formData)
    
    // 提交成功后关闭弹窗
    visible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

// 取消
function handleCancel() {
  visible.value = false
  emit('cancel')
}

// 关闭后回调
function handleAfterLeave() {
  // 重置表单
  formRef.value?.restoreValidation()
  emit('close')
}

// 打开弹窗
function open(data = {}) {
  Object.assign(formData, data)
  visible.value = true
}

// 关闭弹窗
function close() {
  visible.value = false
}

// 设置加载状态
function setLoading(val) {
  loading.value = val
}

// 获取表单数据
function getFormData() {
  return { ...formData }
}

// 重置表单
function resetForm() {
  formRef.value?.restoreValidation()
  Object.keys(formData).forEach((key) => {
    formData[key] = undefined
  })
}

// 暴露方法
defineExpose({
  open,
  close,
  setLoading,
  getFormData,
  resetForm,
  formRef,
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
