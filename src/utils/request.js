import axios from 'axios'
import { forage, ACCESS_TOKEN } from '@/config'
import { message } from '@/utils/discrete'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

// 请求拦截器：自动注入 Token
service.interceptors.request.use(
  async (config) => {
    const token = await forage.get(ACCESS_TOKEN)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      config.headers['X-Access-Token'] = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：统一处理错误
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === '200' || res.success === true || res.code === 200) {
      return res
    }
    if (res.code === 401 || res.code === '401') {
      message.error('登录已过期，请重新登录')
      forage.clear()
      setTimeout(() => { window.location.href = '/user/login' }, 1000)
      return Promise.reject(new Error('登录已过期'))
    }
    message.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      message.error('登录已过期，请重新登录')
      forage.clear()
      setTimeout(() => { window.location.href = '/user/login' }, 1000)
    } else if (status === 403) {
      message.error('暂无权限访问')
    } else if (status === 500) {
      message.error('服务器内部错误')
    } else {
      message.error(error.message || '网络异常')
    }
    return Promise.reject(error)
  }
)

export function getAction(url, params) {
  return service.get(url, { params })
}

export function postAction(url, data) {
  return service.post(url, data)
}

export function putAction(url, data) {
  return service.put(url, data)
}

export function deleteAction(url, params) {
  return service.delete(url, { params })
}

export default service
