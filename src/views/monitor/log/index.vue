<template>
  <div class="page-container">
    <n-card title="操作日志">
      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        remote
        @update:page="(p) => { pagination.page = p; loadData() }"
        @update:page-size="(s) => { pagination.pageSize = s; pagination.page = 1; loadData() }"
      />
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, h, onMounted } from 'vue'
import { NTag } from 'naive-ui'
import { getAction } from '@/utils/request'

const loading = ref(false)
const tableData = ref([])
const pagination = reactive({ page: 1, pageSize: 10, itemCount: 0, showSizePicker: true, pageSizes: [10, 20, 50] })

const columns = [
  { title: '操作人', key: 'username', width: 100 },
  { title: '操作描述', key: 'operation' },
  { title: '请求地址', key: 'requestUrl', ellipsis: { tooltip: true } },
  { title: 'IP', key: 'ip', width: 130 },
  { title: '耗时(ms)', key: 'time', width: 90 },
  {
    title: '状态', key: 'status', width: 80,
    render: (row) => h(NTag, { type: row.status === 1 ? 'success' : 'error', size: 'small' }, { default: () => row.status === 1 ? '成功' : '失败' }),
  },
  { title: '操作时间', key: 'createTime', width: 170 },
]

async function loadData() {
  loading.value = true
  try {
    const res = await getAction('/v1/monitor/log/list', { pageNo: pagination.page, pageSize: pagination.pageSize })
    tableData.value = res.result.records
    pagination.itemCount = res.result.total
  } finally { loading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.page-container { padding: 4px; }
</style>
