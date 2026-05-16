<template>
  <div class="page-container">
    <n-card title="菜单管理">
      <div class="table-toolbar">
        <n-button type="primary" v-has="'menu:add'" @click="handleAdd">
          <template #icon><n-icon :component="AddOutline" /></template>
          新增
        </n-button>
      </div>
      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :row-key="(row) => row.id"
      />
    </n-card>

    <n-modal v-model:show="modalVisible" :title="modalTitle" preset="card" style="width: 520px">
      <n-form ref="formRef" :model="formData" :rules="formRules" label-placement="left" label-width="90">
        <n-form-item label="菜单名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入菜单名称" />
        </n-form-item>
        <n-form-item label="路由路径" path="url">
          <n-input v-model:value="formData.url" placeholder="如：/system/user" />
        </n-form-item>
        <n-form-item label="组件路径" path="component">
          <n-input v-model:value="formData.component" placeholder="如：system/user/index" />
        </n-form-item>
        <n-form-item label="菜单类型" path="menuType">
          <n-radio-group v-model:value="formData.menuType">
            <n-radio :value="0">目录</n-radio>
            <n-radio :value="1">菜单</n-radio>
            <n-radio :value="2">按钮</n-radio>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="图标">
          <n-input v-model:value="formData.icon" placeholder="图标名称" />
        </n-form-item>
        <n-form-item label="排序">
          <n-input-number v-model:value="formData.sortNo" :min="0" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="modalVisible = false">取消</n-button>
          <n-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, h, onMounted } from 'vue'
import { NButton, NSpace, NTag } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import { getAction, postAction, putAction, deleteAction } from '@/utils/request'
import { message } from '@/utils/discrete'
const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref([])
const modalVisible = ref(false)
const modalTitle = ref('新增菜单')
const formRef = ref(null)
const formData = reactive({ id: '', name: '', url: '', component: '', menuType: 1, icon: '', sortNo: 1 })
const formRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
}

const menuTypeMap = { 0: { label: '目录', type: 'info' }, 1: { label: '菜单', type: 'success' }, 2: { label: '按钮', type: 'warning' } }

const columns = [
  { title: '菜单名称', key: 'name' },
  { title: '路由路径', key: 'url' },
  { title: '组件路径', key: 'component' },
  {
    title: '类型', key: 'menuType',
    render: (row) => {
      const t = menuTypeMap[row.menuType] || { label: '未知', type: 'default' }
      return h(NTag, { type: t.type, size: 'small' }, { default: () => t.label })
    },
  },
  { title: '图标', key: 'icon' },
  { title: '排序', key: 'sortNo' },
  {
    title: '操作', key: 'action', width: 160,
    render: (row) => h(NSpace, {}, {
      default: () => [
        h(NButton, { size: 'small', type: 'primary', ghost: true, onClick: () => handleEdit(row) }, { default: () => '编辑' }),
        h(NButton, { size: 'small', type: 'error', ghost: true, onClick: () => handleDelete(row) }, { default: () => '删除' }),
      ],
    }),
  },
]

async function loadData() {
  loading.value = true
  try {
    const res = await getAction('/v1/sys/menu/list')
    tableData.value = res.result
  } finally { loading.value = false }
}

function handleAdd() {
  Object.assign(formData, { id: '', name: '', url: '', component: '', menuType: 1, icon: '', sortNo: 1 })
  modalTitle.value = '新增菜单'
  modalVisible.value = true
}

function handleEdit(row) {
  Object.assign(formData, row)
  modalTitle.value = '编辑菜单'
  modalVisible.value = true
}

async function handleDelete(row) {
  await deleteAction('/v1/sys/menu/delete', { id: row.id })
  message.success('删除成功')
  loadData()
}

async function handleSubmit() {
  await formRef.value?.validate()
  submitLoading.value = true
  try {
    formData.id ? await putAction('/v1/sys/menu/edit', formData) : await postAction('/v1/sys/menu/add', formData)
    message.success('操作成功')
    modalVisible.value = false
    loadData()
  } finally { submitLoading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.page-container { padding: 4px; }
.table-toolbar { margin-bottom: 12px; }
</style>
