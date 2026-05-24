<template>
  <div class="page-container">
    <n-grid :cols="2" :x-gap="16" :y-gap="16">
      <!-- CPU -->
      <n-gi>
        <n-card title="CPU 使用率" :loading="loading">
          <n-progress type="line" :percentage="serverInfo.cpu?.use" :indicator-placement="'inside'" status="success" />
          <n-descriptions :column="2" class="mt-12" label-placement="left" size="small">
            <n-descriptions-item label="核心数">{{ serverInfo.cpu?.cpuNum }} 核</n-descriptions-item>
            <n-descriptions-item label="系统占用">{{ serverInfo.cpu?.sys }}%</n-descriptions-item>
            <n-descriptions-item label="用户占用">{{ serverInfo.cpu?.use }}%</n-descriptions-item>
            <n-descriptions-item label="空闲">{{ serverInfo.cpu?.free }}%</n-descriptions-item>
          </n-descriptions>
        </n-card>
      </n-gi>

      <!-- 内存 -->
      <n-gi>
        <n-card title="内存使用率" :loading="loading">
          <n-progress type="line" :percentage="serverInfo.mem?.usage" :indicator-placement="'inside'" status="warning" />
          <n-descriptions :column="2" class="mt-12" label-placement="left" size="small">
            <n-descriptions-item label="总内存">{{ formatMem(serverInfo.mem?.total) }}</n-descriptions-item>
            <n-descriptions-item label="已使用">{{ formatMem(serverInfo.mem?.used) }}</n-descriptions-item>
            <n-descriptions-item label="剩余">{{ formatMem(serverInfo.mem?.free) }}</n-descriptions-item>
            <n-descriptions-item label="使用率">{{ serverInfo.mem?.usage }}%</n-descriptions-item>
          </n-descriptions>
        </n-card>
      </n-gi>

      <!-- 系统信息 -->
      <n-gi>
        <n-card title="系统信息" :loading="loading">
          <n-descriptions :column="1" label-placement="left" size="small">
            <n-descriptions-item label="服务器名称">{{ serverInfo.sys?.computerName }}</n-descriptions-item>
            <n-descriptions-item label="服务器IP">{{ serverInfo.sys?.computerIp }}</n-descriptions-item>
            <n-descriptions-item label="操作系统">{{ serverInfo.sys?.osName }}</n-descriptions-item>
            <n-descriptions-item label="系统架构">{{ serverInfo.sys?.osArch }}</n-descriptions-item>
          </n-descriptions>
        </n-card>
      </n-gi>

      <!-- 磁盘 -->
      <n-gi>
        <n-card title="磁盘信息" :loading="loading">
          <n-data-table
            :columns="diskColumns"
            :data="serverInfo.sysFiles || []"
            size="small"
          />
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue'
import { NProgress } from 'naive-ui'
import { getAction } from '@/utils/request'

const loading = ref(false)
const serverInfo = ref({})

const diskColumns = [
  { title: '路径', key: 'dirName' },
  { title: '文件系统', key: 'sysTypeName' },
  { title: '总大小', key: 'total' },
  { title: '已用', key: 'used' },
  { title: '剩余', key: 'free' },
  {
    title: '使用率', key: 'usage',
    render: (row) => h(NProgress, { type: 'line', percentage: row.usage, indicatorPlacement: 'inside', style: 'min-width: 100px' }),
  },
]

function formatMem(mb) {
  if (!mb) return '-'
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`
}

async function loadData() {
  loading.value = true
  try {
    const res = await getAction('/v1/monitor/server/info')
    serverInfo.value = res.result
  } finally { loading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.page-container { padding: 4px; }
.mt-12 { margin-top: 12px; }
</style>
