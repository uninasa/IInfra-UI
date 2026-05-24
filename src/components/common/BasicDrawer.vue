<template>
  <n-drawer v-model:show="visible" :width="width" :placement="placement">
    <n-drawer-content :title="title" closable>
      <div class="drawer-container">
        <!-- 搜索区域 -->
        <n-card v-if="searchSchema && searchSchema.length > 0" class="search-card" :bordered="false">
          <n-form :label-width="60">
            <n-form-item
              v-for="item in searchSchema"
              :key="item.field"
              :label="item.label"
            >
              <component
                :is="getSearchComponent(item.component)"
                v-model:value="searchFormData[item.field]"
                v-bind="item.componentProps"
                :placeholder="item.placeholder || `请输入${item.label}`"
                clearable
              />
            </n-form-item>
            <n-form-item>
              <n-space>
                <n-button type="primary" @click="handleSearch">
                  搜索
                </n-button>
                <n-button @click="handleReset">
                  重置
                </n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-card>

        <!-- 工具栏 -->
        <div v-if="showToolbar" class="toolbar">
          <slot name="toolbar" :reload="reload">
            <n-button
              v-if="showAddBtn"
              type="primary"
              @click="handleAdd"
            >
              {{ addBtnText }}
            </n-button>
          </slot>
        </div>

        <!-- 表格区域 -->
        <n-card class="table-card" :bordered="false">
          <n-data-table
            v-bind="$attrs"
            :columns="enhancedColumns"
            :data="tableData"
            :loading="loading"
            :pagination="paginationConfig"
            :remote="remote"
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
          />
        </n-card>
      </div>
    </n-drawer-content>
  </n-drawer>

  <!-- 编辑弹窗 -->
  <BasicModal
    v-if="showModal"
    ref="modalRef"
    v-model:show="modalVisible"
    :title="modalTitle"
    :width="modalWidth"
    :on-submit="handleSubmit"
  >
    <template #form>
      <slot name="form" :formData="formData" :formRef="formRef"></slot>
    </template>
  </BasicModal>
</template>

<script setup>
import { ref, reactive, computed, h } from 'vue'
import { NInput, NSelect, NDatePicker } from 'naive-ui'
import BasicModal from './BasicModal.vue'

const props = defineProps({
  // 抽屉标题
  title: {
    type: String,
    default: '详情',
  },
  // 抽屉宽度
  width: {
    type: Number,
    default: 600,
  },
  // 抽屉位置
  placement: {
    type: String,
    default: 'right',
  },
  // 表格列配置
  columns: {
    type: Array,
    default: () => [],
  },
  // 搜索表单配置
  searchSchema: {
    type: Array,
    default: () => [],
  },
  // 数据加载函数
  loadData: {
    type: Function,
    required: true,
  },
  // 是否远程分页
  remote: {
    type: Boolean,
    default: true,
  },
  // 是否显示工具栏
  showToolbar: {
    type: Boolean,
    default: true,
  },
  // 是否显示新增按钮
  showAddBtn: {
    type: Boolean,
    default: true,
  },
  // 新增按钮文本
  addBtnText: {
    type: String,
    default: '新增',
  },
  // 初始分页配置
  pagination: {
    type: Object,
    default: () => ({ page: 1, pageSize: 10 }),
  },
  // 是否显示编辑弹窗
  showModal: {
    type: Boolean,
    default: true,
  },
  // 弹窗宽度
  modalWidth: {
    type: Number,
    default: 600,
  },
  // 新增弹窗标题
  addModalTitle: {
    type: String,
    default: '新增',
  },
  // 编辑弹窗标题
  editModalTitle: {
    type: String,
    default: '编辑',
  },
})

const emit = defineEmits(['add', 'edit', 'search', 'reset', 'submit'])

const visible = ref(false)
const loading = ref(false)
const tableData = ref([])
const searchFormData = reactive({})
const modalRef = ref(null)
const formRef = ref(null)
const modalVisible = ref(false)
const modalTitle = ref('')
const formData = ref({})
const parentId = ref(null) // 父级ID

const paginationInfo = reactive({
  page: props.pagination.page || 1,
  pageSize: props.pagination.pageSize || 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  prefix: ({ itemCount }) => `共 ${itemCount} 条`,
})

// 初始化搜索表单数据
props.searchSchema.forEach((item) => {
  searchFormData[item.field] = item.defaultValue ?? ''
})

// 表格列配置（处理插槽列）
const enhancedColumns = computed(() => {
  return props.columns.map((col) => {
    // 如果列的 key 在插槽中定义，使用插槽渲染
    if (col.key && slots[col.key]) {
      return {
        ...col,
        render: (row, index) => {
          return h('div', {}, slots[col.key]({ row, index }))
        },
      }
    }
    return col
  })
})

// 获取插槽
const slots = defineSlots()

// 分页配置
const paginationConfig = computed(() => {
  return props.remote ? paginationInfo : false
})

// 获取搜索组件
function getSearchComponent(component) {
  const componentMap = {
    input: NInput,
    select: NSelect,
    datePicker: NDatePicker,
  }
  return componentMap[component] || NInput
}

// 打开抽屉
function open(id, initialData = {}) {
  parentId.value = id
  visible.value = true
  
  // 重置搜索条件
  Object.keys(searchFormData).forEach((key) => {
    const schema = props.searchSchema.find((item) => item.field === key)
    searchFormData[key] = schema?.defaultValue ?? ''
  })
  
  // 重置分页
  paginationInfo.page = 1
  
  loadTableData()
}

// 关闭抽屉
function close() {
  visible.value = false
}

// 加载数据
async function loadTableData() {
  loading.value = true
  try {
    const params = {
      pageNo: paginationInfo.page,
      pageSize: paginationInfo.pageSize,
      ...searchFormData,
    }
    
    const res = await props.loadData(parentId.value, params)
    
    // 兼容不同的返回格式
    if (res.result) {
      tableData.value = res.result.records || res.result
      paginationInfo.itemCount = res.result.total || 0
    } else {
      tableData.value = res.records || res
      paginationInfo.itemCount = res.total || 0
    }
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  paginationInfo.page = 1
  loadTableData()
  emit('search', searchFormData)
}

// 重置
function handleReset() {
  Object.keys(searchFormData).forEach((key) => {
    const schema = props.searchSchema.find((item) => item.field === key)
    searchFormData[key] = schema?.defaultValue ?? ''
  })
  paginationInfo.page = 1
  loadTableData()
  emit('reset')
}

// 新增
function handleAdd() {
  modalTitle.value = props.addModalTitle
  formData.value = {}
  modalVisible.value = true
  emit('add', { parentId: parentId.value })
}

// 编辑
function handleEdit(row) {
  modalTitle.value = props.editModalTitle
  formData.value = { ...row }
  modalVisible.value = true
  emit('edit', row)
}

// 提交
async function handleSubmit() {
  try {
    await emit('submit', {
      formData: formData.value,
      parentId: parentId.value,
      isEdit: !!formData.value.id,
      reload: loadTableData,
    })
  } catch (error) {
    throw error
  }
}

// 分页改变
function handlePageChange(page) {
  paginationInfo.page = page
  loadTableData()
}

// 每页条数改变
function handlePageSizeChange(pageSize) {
  paginationInfo.pageSize = pageSize
  paginationInfo.page = 1
  loadTableData()
}

// 刷新
function reload() {
  loadTableData()
}

// 获取表格数据
function getTableData() {
  return tableData.value
}

// 获取搜索参数
function getSearchParams() {
  return { ...searchFormData }
}

// 获取父级ID
function getParentId() {
  return parentId.value
}

// 暴露方法
defineExpose({
  open,
  close,
  reload,
  handleEdit,
  getTableData,
  getSearchParams,
  getParentId,
  loading,
})
</script>

<style scoped>
.drawer-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.search-card {
  flex-shrink: 0;
}

.search-card :deep(.n-card__content) {
  padding-top: 0;
  padding-bottom: 0;
}

.toolbar {
  flex-shrink: 0;
  margin-bottom: 0;
  padding-left: 24px;
}

.table-card {
  flex: 1;
  overflow: hidden;
}

.table-card :deep(.n-card__content) {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
