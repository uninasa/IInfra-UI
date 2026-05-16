<template>
  <div class="page-container">
    <n-card title="用户管理">
      <!-- 搜索栏 -->
      <n-form inline :model="searchForm" class="search-form">
        <n-form-item label="用户名">
          <n-input v-model:value="searchForm.username" placeholder="请输入用户名" clearable />
        </n-form-item>
        <n-form-item label="姓名">
          <n-input v-model:value="searchForm.realname" placeholder="请输入姓名" clearable />
        </n-form-item>
        <n-form-item>
          <n-space>
            <n-button type="primary" @click="loadData">查询</n-button>
            <n-button @click="resetSearch">重置</n-button>
          </n-space>
        </n-form-item>
      </n-form>

      <!-- 操作按钮 -->
      <div class="table-toolbar">
        <n-button type="primary" v-has="'user:add'" @click="handleAdd">
          <template #icon><n-icon :component="AddOutline" /></template>
          新增
        </n-button>
      </div>

      <!-- 表格 -->
      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        remote
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </n-card>

    <!-- 新增/编辑弹窗 -->
    <n-modal v-model:show="modalVisible" :title="modalTitle" preset="card" style="width: 500px">
      <n-form ref="formRef" :model="formData" :rules="formRules" label-placement="left" label-width="80">
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="formData.username" placeholder="请输入用户名" :disabled="!!formData.id" />
        </n-form-item>
        <n-form-item label="姓名" path="realname">
          <n-input v-model:value="formData.realname" placeholder="请输入姓名" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="formData.email" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item label="手机号" path="phone">
          <n-input v-model:value="formData.phone" placeholder="请输入手机号" />
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
const modalTitle = ref('新增用户')
const formRef = ref(null)

const searchForm = reactive({ username: '', realname: '' })
const formData = reactive({ id: '', username: '', realname: '', email: '', phone: '' })
const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
}

const pagination = reactive({ page: 1, pageSize: 10, itemCount: 0, showSizePicker: true, pageSizes: [10, 20, 50] })

const columns = [
  { title: '用户名', key: 'username' },
  { title: '姓名', key: 'realname' },
  { title: '邮箱', key: 'email' },
  { title: '手机号', key: 'phone' },
  {
    title: '状态', key: 'status',
    render: (row) => h(NTag, { type: row.status === 1 ? 'success' : 'error' }, { default: () => row.status === 1 ? '启用' : '禁用' }),
  },
  { title: '创建时间', key: 'createTime' },
  {
    title: '操作', key: 'action', fixed: 'right', width: 160,
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
    const res = await getAction('/v1/sys/user/list', {
      pageNo: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm,
    })
    tableData.value = res.result.records
    pagination.itemCount = res.result.total
  } finally {
    loading.value = false
  }
}

function resetSearch() {
  searchForm.username = ''
  searchForm.realname = ''
  pagination.page = 1
  loadData()
}

function handleAdd() {
  Object.assign(formData, { id: '', username: '', realname: '', email: '', phone: '' })
  modalTitle.value = '新增用户'
  modalVisible.value = true
}

function handleEdit(row) {
  Object.assign(formData, row)
  modalTitle.value = '编辑用户'
  modalVisible.value = true
}

async function handleDelete(row) {
  await deleteAction('/v1/sys/user/delete', { id: row.id })
  message.success('删除成功')
  loadData()
}

async function handleSubmit() {
  await formRef.value?.validate()
  submitLoading.value = true
  try {
    if (formData.id) {
      await putAction('/v1/sys/user/edit', formData)
    } else {
      await postAction('/v1/sys/user/add', formData)
    }
    message.success(formData.id ? '编辑成功' : '新增成功')
    modalVisible.value = false
    loadData()
  } finally {
    submitLoading.value = false
  }
}

function handlePageChange(page) { pagination.page = page; loadData() }
function handlePageSizeChange(size) { pagination.pageSize = size; pagination.page = 1; loadData() }

onMounted(loadData)
</script>

<style scoped>
.page-container { padding: 4px; }
.search-form { margin-bottom: 16px; }
.table-toolbar { margin-bottom: 12px; }
</style>
