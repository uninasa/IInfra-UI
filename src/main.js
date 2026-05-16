import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.css'
import { setupRouter } from './router'
import { setupStore } from './store'
import { setupPermission } from './permission'
import { setupDirectives } from './directives'

async function bootstrap() {
  const app = createApp(App)

  // 注册状态管理
  setupStore(app)

  // 注册路由
  const router = setupRouter(app)

  // 注册自定义指令（v-has 权限指令）
  setupDirectives(app)

  // 初始化路由守卫
  setupPermission(router)

  app.mount('#app')
}

bootstrap()
