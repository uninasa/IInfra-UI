/**
 * 运维监控相关 Mock 接口
 */
export default [
  // ==================== 服务器监控 ====================
  {
    url: '/api/v1/monitor/server/info',
    method: 'get',
    response: () => ({
      code: '200',
      success: true,
      result: {
        cpu: { use: 35.6, sys: 12.3, free: 52.1, cpuNum: 8 },
        mem: { total: 16384, used: 8192, free: 8192, usage: 50.0 },
        jvm: { total: 2048, max: 4096, free: 1024, usage: 50.0, version: '17.0.8', home: '/usr/lib/jvm/java-17' },
        sys: { computerName: 'iinfra-server', computerIp: '192.168.1.100', osName: 'Linux', osArch: 'amd64', userDir: '/app' },
        sysFiles: [
          { dirName: '/', sysTypeName: 'ext4', typeName: '/', total: '100 GB', free: '60 GB', used: '40 GB', usage: 40.0 },
        ],
      },
    }),
  },

  // ==================== 操作日志 ====================
  {
    url: '/api/v1/monitor/log/list',
    method: 'get',
    response: ({ query }) => {
      const { pageNo = 1, pageSize = 10 } = query
      const list = Array.from({ length: 50 }, (_, i) => ({
        id: String(i + 1),
        username: i % 3 === 0 ? 'admin' : `user${i % 5}`,
        operation: ['登录系统', '查询用户', '新增角色', '修改菜单', '删除日志'][i % 5],
        method: 'POST',
        requestUrl: ['/api/v1/sys/login', '/api/v1/sys/user/list', '/api/v1/sys/role/add'][i % 3],
        ip: `192.168.1.${(i % 254) + 1}`,
        time: Math.floor(Math.random() * 500) + 50,
        createTime: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:00:00`,
        status: i % 10 === 0 ? 0 : 1,
      }))
      const total = list.length
      const start = (pageNo - 1) * pageSize
      return {
        code: '200',
        success: true,
        result: {
          records: list.slice(start, start + Number(pageSize)),
          total,
          pageNo: Number(pageNo),
          pageSize: Number(pageSize),
        },
      }
    },
  },
]
