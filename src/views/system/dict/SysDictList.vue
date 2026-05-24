<template>
  <div class="page-container">
    <n-card title="字典表管理">
      <!-- 使用封装的表格组件 -->
      <BasicTable
        ref="tableRef"
        :columns="columns"
        :search-schema="searchSchema"
        :load-data="loadData"
      >
        <!-- 自定义工具栏按钮 -->
        <template #toolbar="{ reload }">
          <n-space>
            <n-button type="primary" @click="handleAdd">
              新增
            </n-button>
            <n-button @click="handleRefreshCache" :loading="refreshLoading">
              刷新缓存
            </n-button>
          </n-space>
        </template>

        <!-- 自定义操作列 -->
        <template #action="{ row }">
          <n-space>
            <n-button
              size="small"
              type="primary"
              ghost
              v-has="'sys_dict:edit'"
              @click="handleEdit(row)"
            >
              编辑
            </n-button>
            <n-button
              size="small"
              type="info"
              ghost
              @click="handleDictConfig(row)"
            >
              字典配置
            </n-button>
            <n-popconfirm @positive-click="handleDelete(row)">
              <template #trigger>
                <n-button
                  size="small"
                  type="error"
                  ghost
                  v-has="'sys_dict:delete'"
                >
                  删除
                </n-button>
              </template>
              确定删除该记录吗？
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
        <SysDictForm ref="formRef" v-model="formData" />
      </template>
    </BasicModal>

    <!-- 字典配置抽屉 -->
    <SysDictItemDrawer ref="drawerRef" />
  </div>
</template>

<script setup>
import { ref, reactive, h } from 'vue'
import { NTag } from 'naive-ui'
import BasicTable from '@/components/common/BasicTable.vue'
import BasicModal from '@/components/common/BasicModal.vue'
import SysDictForm from './components/SysDictForm.vue'
import SysDictItemDrawer from './components/SysDictItemDrawer.vue'
import { getAction, postAction, deleteAction } from '@/utils/request'
import { message } from '@/utils/discrete'

const tableRef = ref(null)
const modalRef = ref(null)
const formRef = ref(null)
const drawerRef = ref(null)
const modalVisible = ref(false)
const modalTitle = ref('新增字典表')
const refreshLoading = ref(false)

const formData = reactive({
  dictName: '',
  dictCode: '',
  description: '',
})

// 搜索表单配置
const searchSchema = [
  {
    field: 'dictName',
    label: '字典名词',
    component: 'input',
    placeholder: '请输入字典名词',
  },
  {
    field: 'dictCode',
    label: '字典编码',
    component: 'input',
    placeholder: '请输入字典编码',
  },
  {
    field: 'description',
    label: '描述',
    component: 'input',
    placeholder: '请输入描述',
  },
]

// 表格列配置
const columns = [
  {
    title: '字典名词',
    key: 'dictName',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '字典编码',
    key: 'dictCode',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '描述',
    key: 'description',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 240,
    fixed: 'right',
  },
]

// 加载数据
async function loadData(params) {
  const res = await getAction('/sys/dict/list', params)
  return res.data.records
}

// 新增
function handleAdd() {
  modalTitle.value = '新增字典表'
  Object.assign(formData, {
    dictName: '',
    dictCode: '',
    description: '',
  })
  modalVisible.value = true
}

// 编辑
function handleEdit(row) {
  modalTitle.value = '编辑字典表'
  Object.assign(formData, row)
  modalVisible.value = true
}

// 删除
async function handleDelete(row) {
  try {
    await deleteAction('/sys/dict/delete', { id: row.id })
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
    await formRef.value?.validate()
    
    if (formData.id) {
      await postAction('/sys/dict/edit', formData)
      message.success('编辑成功')
    } else {
      await postAction('/sys/dict/add', formData)
      message.success('新增成功')
    }
    
    // 刷新表格
    tableRef.value?.reload()
  } catch (error) {
    console.error('提交失败:', error)
    throw error // 抛出错误，阻止弹窗关闭
  }
}

// 刷新缓存
async function handleRefreshCache() {
  try {
    refreshLoading.value = true
    await getAction('/sys/dict/refreshCache')
    message.success('缓存刷新成功')
  } catch (error) {
    console.error('刷新缓存失败:', error)
    message.error('刷新缓存失败')
  } finally {
    refreshLoading.value = false
  }
}

// 字典配置
function handleDictConfig(row) {
  drawerRef.value?.open(row.id)
}
</script>

<style scoped>
.page-container {
  padding: 4px;
}
</style>

