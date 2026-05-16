/**
 * 自定义 Vite Mock 插件
 * 零依赖，直接拦截 dev server 请求，匹配 mock 文件中的路由定义
 * 兼容 Vite 5，不依赖 vite-plugin-mock
 */
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

export function createMockPlugin(options = {}) {
  const { mockPath = 'mock' } = options

  return {
    name: 'vite-plugin-mock-local',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 只拦截 /api 开头的请求
        if (!req.url || !req.url.startsWith('/api')) {
          return next()
        }

        const mockDir = path.resolve(process.cwd(), mockPath)
        const mocks = await loadMocks(mockDir)

        // 解析请求 URL（去掉 query string）
        const urlPath = req.url.split('?')[0]
        const method = req.method.toLowerCase()

        // 查找匹配的 mock 定义
        const matched = mocks.find(
          (m) => m.url === urlPath && m.method.toLowerCase() === method
        )

        if (!matched) {
          return next()
        }

        // 读取请求体
        let body = {}
        if (method === 'post' || method === 'put') {
          body = await parseBody(req)
        }

        // 解析 query 参数
        const query = parseQuery(req.url)

        // 执行 mock handler
        const result = matched.response({ body, query, headers: req.headers })

        // 返回 JSON 响应
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end(JSON.stringify(result))
      })
    },
  }
}

/**
 * 加载 mock 目录下所有 .js 文件
 */
async function loadMocks(mockDir) {
  const mocks = []

  if (!fs.existsSync(mockDir)) return mocks

  const files = fs.readdirSync(mockDir).filter(
    (f) => f.endsWith('.js') && !f.startsWith('_')
  )

  for (const file of files) {
    const filePath = path.resolve(mockDir, file)
    const fileUrl = pathToFileURL(filePath).href
    // 加时间戳避免缓存
    const mod = await import(`${fileUrl}?t=${Date.now()}`)
    const routes = mod.default || []
    mocks.push(...routes)
  }

  return mocks
}

/**
 * 解析请求体
 */
function parseBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        resolve({})
      }
    })
  })
}

/**
 * 解析 URL query 参数
 */
function parseQuery(url) {
  const query = {}
  const idx = url.indexOf('?')
  if (idx === -1) return query
  const search = url.slice(idx + 1)
  search.split('&').forEach((pair) => {
    const [key, val] = pair.split('=')
    if (key) query[decodeURIComponent(key)] = decodeURIComponent(val || '')
  })
  return query
}
