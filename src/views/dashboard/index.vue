<template>
  <div class="dashboard">
    <n-grid :cols="4" :x-gap="16" :y-gap="16">
      <n-gi v-for="card in statCards" :key="card.title">
        <n-card :bordered="false" class="stat-card">
          <div class="stat-card__content">
            <div class="stat-card__info">
              <div class="stat-card__value">{{ card.value }}</div>
              <div class="stat-card__title">{{ card.title }}</div>
            </div>
            <n-icon :component="card.icon" :size="48" :color="card.color" />
          </div>
        </n-card>
      </n-gi>
    </n-grid>

    <n-grid :cols="2" :x-gap="16" :y-gap="16" class="mt-16">
      <n-gi>
        <n-card title="快速入口" :bordered="false">
          <n-space>
            <n-button type="primary" v-has="'dashboard:view'">数据看板</n-button>
            <n-button type="info" v-has="'user:list'">用户管理</n-button>
            <n-button type="success" v-has="'role:list'">角色管理</n-button>
            <n-button type="warning" v-has="'menu:list'">菜单管理</n-button>
          </n-space>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="系统信息" :bordered="false">
          <n-descriptions :column="1" label-placement="left">
            <n-descriptions-item label="当前用户">
              {{ userStore.userInfo?.realname || userStore.userInfo?.username }}
            </n-descriptions-item>
            <n-descriptions-item label="框架版本">Vue 3 + Naive UI</n-descriptions-item>
            <n-descriptions-item label="权限模式">动态路由 + 细粒度权限</n-descriptions-item>
          </n-descriptions>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup>
import { PeopleOutline, ServerOutline, ShieldCheckmarkOutline, BarChartOutline } from '@vicons/ionicons5'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const statCards = [
  { title: '用户总数', value: '1,024', icon: PeopleOutline, color: '#18a058' },
  { title: '服务器', value: '32', icon: ServerOutline, color: '#2080f0' },
  { title: '权限数量', value: '256', icon: ShieldCheckmarkOutline, color: '#f0a020' },
  { title: '今日访问', value: '8,888', icon: BarChartOutline, color: '#d03050' },
]
</script>

<style scoped>
.dashboard {
  padding: 4px;
}

.stat-card__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-card__value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-card__title {
  font-size: 14px;
  color: var(--n-text-color-3);
}

.mt-16 {
  margin-top: 16px;
}
</style>
