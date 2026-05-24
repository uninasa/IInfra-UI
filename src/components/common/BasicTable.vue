<template>
  <div class="basic-table">
    <!-- 搜索栏 -->
    <n-form
      v-if="searchSchema && searchSchema.length > 0"
      inline
      :model="searchFormData"
      class="search-form"
      label-placement="left"
    >
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
          <n-button type="primary" @click="handleSearch">查询</n-button>
          <n-button @click="handleReset">重置</n-button>
        </n-space>
      </n-form-item>
    </n-form>

    <!-- 工具栏 -->
    <div v-if="showToolbar" class="table-toolbar">
      <slot name="toolbar" :reload="reload">
        <n-button
          v-if="showAddBtn"
          type="primary"
          @click="handleAdd"
        >
          <template #icon><n-icon :component="AddOutline" /></template>
          {{ addBtnText }}
        </n-button>
      </slot>
    </div>

    <!-- 表格 -->
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, h } from 'vue'
import { NInput, NSelect, NDatePicker } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'

const props = defineProps({
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
  // 是否立即加载
  immediate: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['add', 'search', 'reset'])

const loading = ref(false)
const tableData = ref([])
const searchFormData = reactive({})
const paginationInfo = reactive({
  page: props.pagination.page || 1,
  pageSize: props.pagination.pageSize || 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
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

// 加载数据
async function loadTableData() {
  loading.value = true
  try {
    const params = {
      pageNo: paginationInfo.page,
      pageSize: paginationInfo.pageSize,
      ...searchFormData,
    }
    const res = await props.loadData(params)
    
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
  emit('add')
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

// 暴露方法
defineExpose({
  reload,
  getTableData,
  getSearchParams,
  loading,
})

// 初始加载
onMounted(() => {
  if (props.immediate) {
    loadTableData()
  }
})
</script>

<style scoped>
.basic-table {
  width: 100%;
}

.search-form {
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
}

.table-toolbar {
  margin-bottom: 12px;
}
</style>
