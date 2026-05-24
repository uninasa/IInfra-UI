<template>
  <div class="page-container">
    <n-card title="角色管理">
      <div class="table-toolbar">
        <n-button type="primary" v-has="'role:add'" @click="handleAdd">
          <template #icon><n-icon :component="AddOutline" /></template>
          新增
        </n-button>
      </div>
      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        remote
        @update:page="(p) => { pagination.page = p; loadData() }"
      />
    </n-card>

    <n-modal v-model:show="modalVisible" :title="modalTitle" preset="card" style="width: 480px">
      <n-form ref="formRef" :model="formData" :rules="formRules" label-placement="left" label-width="80">
        <n-form-item label="角色名称" path="roleName">
          <n-input v-model:value="formData.roleName" placeholder="请输入角色名称" />
        </n-form-item>
        <n-form-item label="角色编码" path="roleCode">
          <n-input v-model:value="formData.roleCode" placeholder="请输入角色编码" :disabled="!!formData.id" />
        </n-form-item>
        <n-form-item label="描述">
          <n-input v-model:value="formData.description" type="textarea" placeholder="请输入描述" />
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
const modalTitle = ref('新增角色')
const formRef = ref(null)
const formData = reactive({ id: '', roleName: '', roleCode: '', description: '' })
const formRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
}
const pagination = reactive({ page: 1, pageSize: 10, itemCount: 0 })

const columns = [
  { title: '角色名称', key: 'roleName' },
  { title: '角色编码', key: 'roleCode' },
  { title: '描述', key: 'description' },
  {
    title: '状态', key: 'status',
    render: (row) => h(NTag, { type: row.status === 1 ? 'success' : 'error' }, { default: () => row.status === 1 ? '启用' : '禁用' }),
  },
  { title: '创建时间', key: 'createTime' },
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
    const res = await getAction('/v1/sys/role/list', { pageNo: pagination.page, pageSize: pagination.pageSize })
    tableData.value = res.result.records
    pagination.itemCount = res.result.total
  } finally { loading.value = false }
}

function handleAdd() {
  Object.assign(formData, { id: '', roleName: '', roleCode: '', description: '' })
  modalTitle.value = '新增角色'
  modalVisible.value = true
}

function handleEdit(row) {
  Object.assign(formData, row)
  modalTitle.value = '编辑角色'
  modalVisible.value = true
}

async function handleDelete(row) {
  await deleteAction('/v1/sys/role/delete', { id: row.id })
  message.success('删除成功')
  loadData()
}

async function handleSubmit() {
  await formRef.value?.validate()
  submitLoading.value = true
  try {
    formData.id ? await putAction('/v1/sys/role/edit', formData) : await postAction('/v1/sys/role/add', formData)
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
