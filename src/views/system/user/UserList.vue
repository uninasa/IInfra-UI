<template>
  <div class="page-container">
    <n-card title="用户管理">
      <!-- 使用封装的表格组件 -->
      <BasicTable
        ref="tableRef"
        :columns="columns"
        :search-schema="searchSchema"
        :load-data="loadData"
        @add="handleAdd"
      >
        <!-- 自定义操作列 -->
        <template #action="{ row }">
          <n-space>
            <n-button
              size="small"
              type="primary"
              ghost
              v-has="'user:edit'"
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
                  v-has="'user:delete'"
                >
                  删除
                </n-button>
              </template>
              确定删除该用户吗？
            </n-popconfirm>
          </n-space>
        </template>
      </BasicTable>
    </n-card>

    <!-- 使用封装的弹窗组件 -->
    <BasicModal
      ref="modalRef"
      v-model:show="modalVisible"
      :title="modalTitle"
      :width="600"
      :on-submit="handleSubmit"
    >
      <template #form="{ formData: modalFormData }">
        <UserForm ref="userFormRef" v-model="formData" />
      </template>
    </BasicModal>
  </div>
</template>

<script setup>
import { ref, reactive, h } from 'vue'
import { NTag, NAvatar } from 'naive-ui'
import BasicTable from '@/components/common/BasicTable.vue'
import BasicModal from '@/components/common/BasicModal.vue'
import UserForm from './components/UserForm.vue'
import { getAction, postAction, putAction, deleteAction } from '@/utils/request'
import { message } from '@/utils/discrete'

const tableRef = ref(null)
const modalRef = ref(null)
const userFormRef = ref(null)
const modalVisible = ref(false)
const modalTitle = ref('新增用户')

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

// 搜索表单配置
const searchSchema = [
  {
    field: 'username',
    label: '用户名',
    component: 'input',
    placeholder: '请输入用户名',
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'input',
    placeholder: '请输入昵称',
  },
]

// 表格列配置
const columns = [
  {
    title: '用户名',
    key: 'username',
    width: 120,
  },
  {
    title: '昵称',
    key: 'nickname',
    width: 100,
  },
  {
    title: '头像',
    key: 'avatar',
    width: 80,
    render: (row) =>
      h(NAvatar, {
        size: 40,
        src: row.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + row.username,
        fallbackSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
      }),
  },
  {
    title: '邮箱',
    key: 'email',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '手机号',
    key: 'phone',
    width: 130,
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    render: (row) =>
      h(
        NTag,
        { type: row.status === 1 ? 'success' : 'error', size: 'small' },
        { default: () => (row.status === 1 ? '启用' : '禁用') }
      ),
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 170,
  },
  {
    title: '操作',
    key: 'action',
    width: 160,
    fixed: 'right',
  },
]

// 加载数据
async function loadData(params) {
  const res = await getAction('/sys/user/list', params)
  return res.data.records
}

// 新增
function handleAdd() {
  modalTitle.value = '新增用户'
  Object.assign(formData, {
    id: '',
    username: '',
    nickname: '',
    avatar: '',
    email: '',
    phone: '',
    password: '',
    status: 1,
  })
  modalVisible.value = true
}

// 编辑
function handleEdit(row) {
  modalTitle.value = '编辑用户'
  Object.assign(formData, row)
  modalVisible.value = true
}

// 删除
async function handleDelete(row) {
  try {
    await deleteAction('/sys/user/delete', { id: row.id })
    message.success('删除成功')
    tableRef.value?.reload()
  } catch (error) {
    message.error('删除失败')
  }
}

// 提交
async function handleSubmit() {
  try {
    // 先验证表单
    await userFormRef.value?.validate()
    
    console.log('提交的数据:', formData)
    
    if (formData.id) {
      await postAction('/sys/user/edit', formData)
      message.success('编辑成功')
    } else {
      await postAction('/sys/user/add', formData)
      message.success('新增成功')
    }
    
    // 刷新表格
    tableRef.value?.reload()
  } catch (error) {
    console.error('提交失败:', error)
    throw error // 抛出错误，阻止弹窗关闭
  }
}
</script>

<style scoped>
.page-container {
  padding: 4px;
}
</style>
