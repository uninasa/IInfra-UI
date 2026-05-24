<template>
  <BasicDrawer
    ref="drawerRef"
    title="字典配置"
    :width="600"
    :columns="columns"
    :search-schema="searchSchema"
    :load-data="loadData"
    add-modal-title="新增字典项"
    edit-modal-title="编辑字典项"
    :modal-width="500"
    @add="handleAdd"
    @edit="handleEditOpen"
    @submit="handleSubmit"
  >
    <!-- 自定义操作列 -->
    <template #action="{ row }">
      <n-space>
        <n-button
          size="small"
          type="info"
          ghost
          @click="handleEdit(row)"
        >
          编辑
        </n-button>
        <n-popconfirm @positive-click="handleDelete(row)">
          <template #trigger>
            <n-button
              size="small"
              type="error"
              ghost
            >
              删除
            </n-button>
          </template>
          确定删除该记录吗？
        </n-popconfirm>
      </n-space>
    </template>

    <!-- 表单内容 -->
    <template #form>
      <SysDictItemForm ref="formRef" v-model="localFormData" />
    </template>
  </BasicDrawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { NSpace, NButton, NPopconfirm } from 'naive-ui'
import BasicDrawer from '@/components/common/BasicDrawer.vue'
import SysDictItemForm from './SysDictItemForm.vue'
import { getAction, postAction, deleteAction } from '@/utils/request'
import { message } from '@/utils/discrete'

const drawerRef = ref(null)
const formRef = ref(null)

// 本地表单数据
const localFormData = reactive({
  itemText: '',
  itemValue: '',
  sortOrder: 0,
  status: 1,
  remark: '',
})

// 搜索表单配置
const searchSchema = [
  {
    field: 'itemText',
    label: '名称:',
    component: 'input',
    placeholder: '请输入名称',
  },
]

// 表格列配置
const columns = [
  {
    title: '名称',
    key: 'itemText',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '数据值',
    key: 'itemValue',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
  },
]

// 加载数据
async function loadData(dictId, params) {
  const res = await getAction('/sys/dict/item/list', {
    dictId,
    ...params,
  })
  return res.data
}

// 新增
function handleAdd() {
  Object.assign(localFormData, {
    itemText: '',
    itemValue: '',
    sortOrder: 0,
    status: 1,
    remark: '',
  })
}

// 打开编辑
function handleEditOpen(row) {
  Object.assign(localFormData, row)
}

// 编辑
function handleEdit(row) {
  drawerRef.value?.handleEdit(row)
}

// 删除
async function handleDelete(row) {
  try {
    await deleteAction('/sys/dict/item/delete', { id: row.id })
    message.success('删除成功')
    drawerRef.value?.reload()
  } catch (error) {
    message.error('删除失败')
  }
}

// 提交
async function handleSubmit({ formData, parentId, isEdit, reload }) {
  try {
    // 先验证表单
    await formRef.value?.validate()
    
    // 添加父级ID
    const submitData = {
      ...localFormData,
      dictId: parentId,
    }
    
    if (isEdit) {
      await postAction('/sys/dict/item/edit', submitData)
      message.success('编辑成功')
    } else {
      await postAction('/sys/dict/item/add', submitData)
      message.success('新增成功')
    }
    
    // 刷新表格
    reload()
  } catch (error) {
    console.error('提交失败:', error)
    throw error // 抛出错误，阻止弹窗关闭
  }
}

// 打开抽屉
function open(dictId) {
  drawerRef.value?.open(dictId)
}

// 暴露方法给父组件
defineExpose({
  open,
})
</script>
