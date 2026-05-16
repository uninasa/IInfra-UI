/**
 * 系统管理相关 Mock 接口
 * 用户管理 / 角色管理 / 菜单管理
 */

// 模拟用户数据
const userList = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  username: i === 0 ? 'admin' : `user${i}`,
  realname: i === 0 ? '超级管理员' : `测试用户${i}`,
  email: `user${i}@iinfra.com`,
  phone: `1380000${String(i).padStart(4, '0')}`,
  status: i % 5 === 0 ? 0 : 1,  // 0:禁用 1:启用
  roleNames: i === 0 ? '超级管理员' : '普通用户',
  createTime: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`,
}))

// 模拟角色数据
const roleList = [
  { id: '1', roleName: '超级管理员', roleCode: 'admin', description: '拥有所有权限', status: 1, createTime: '2024-01-01 00:00:00' },
  { id: '2', roleName: '运维人员', roleCode: 'ops', description: '运维监控权限', status: 1, createTime: '2024-01-02 00:00:00' },
  { id: '3', roleName: '普通用户', roleCode: 'user', description: '基础查看权限', status: 1, createTime: '2024-01-03 00:00:00' },
  { id: '4', roleName: '访客', roleCode: 'guest', description: '只读权限', status: 0, createTime: '2024-01-04 00:00:00' },
]

export default [
  // ==================== 用户管理 ====================
  {
    url: '/api/v1/sys/user/list',
    method: 'get',
    response: ({ query }) => {
      const { pageNo = 1, pageSize = 10, username = '', realname = '' } = query
      let list = userList.filter((u) => {
        return (
          (!username || u.username.includes(username)) &&
          (!realname || u.realname.includes(realname))
        )
      })
      const total = list.length
      const start = (pageNo - 1) * pageSize
      list = list.slice(start, start + Number(pageSize))
      return {
        code: '200',
        success: true,
        result: { records: list, total, pageNo: Number(pageNo), pageSize: Number(pageSize) },
      }
    },
  },
  {
    url: '/api/v1/sys/user/add',
    method: 'post',
    response: () => ({ code: '200', success: true, message: '新增成功' }),
  },
  {
    url: '/api/v1/sys/user/edit',
    method: 'put',
    response: () => ({ code: '200', success: true, message: '编辑成功' }),
  },
  {
    url: '/api/v1/sys/user/delete',
    method: 'delete',
    response: () => ({ code: '200', success: true, message: '删除成功' }),
  },
  {
    url: '/api/v1/sys/user/enable',
    method: 'put',
    response: () => ({ code: '200', success: true, message: '操作成功' }),
  },

  // ==================== 角色管理 ====================
  {
    url: '/api/v1/sys/role/list',
    method: 'get',
    response: ({ query }) => {
      const { pageNo = 1, pageSize = 10 } = query
      const total = roleList.length
      const start = (pageNo - 1) * pageSize
      const list = roleList.slice(start, start + Number(pageSize))
      return {
        code: '200',
        success: true,
        result: { records: list, total, pageNo: Number(pageNo), pageSize: Number(pageSize) },
      }
    },
  },
  {
    url: '/api/v1/sys/role/add',
    method: 'post',
    response: () => ({ code: '200', success: true, message: '新增成功' }),
  },
  {
    url: '/api/v1/sys/role/edit',
    method: 'put',
    response: () => ({ code: '200', success: true, message: '编辑成功' }),
  },
  {
    url: '/api/v1/sys/role/delete',
    method: 'delete',
    response: () => ({ code: '200', success: true, message: '删除成功' }),
  },

  // ==================== 菜单管理 ====================
  {
    url: '/api/v1/sys/menu/list',
    method: 'get',
    response: () => ({
      code: '200',
      success: true,
      result: [
        { id: '1', parentId: '0', name: '工作台', url: '/dashboard', component: 'dashboard/index', icon: 'BarChartOutline', menuType: 1, sortNo: 1, keepAlive: 0 },
        { id: '2', parentId: '0', name: '系统管理', url: '/system', component: 'Layout', icon: 'SettingsOutline', menuType: 0, sortNo: 2, keepAlive: 0 },
        { id: '3', parentId: '2', name: '用户管理', url: '/system/user', component: 'system/user/index', icon: 'PeopleOutline', menuType: 1, sortNo: 1, keepAlive: 1 },
        { id: '4', parentId: '2', name: '角色管理', url: '/system/role', component: 'system/role/index', icon: 'ShieldOutline', menuType: 1, sortNo: 2, keepAlive: 1 },
        { id: '5', parentId: '2', name: '菜单管理', url: '/system/menu', component: 'system/menu/index', icon: 'MenuOutline', menuType: 1, sortNo: 3, keepAlive: 1 },
        { id: '6', parentId: '0', name: '运维监控', url: '/monitor', component: 'Layout', icon: 'PulseOutline', menuType: 0, sortNo: 3, keepAlive: 0 },
        { id: '7', parentId: '6', name: '服务器监控', url: '/monitor/server', component: 'monitor/server/index', icon: 'ServerOutline', menuType: 1, sortNo: 1, keepAlive: 0 },
        { id: '8', parentId: '6', name: '操作日志', url: '/monitor/log', component: 'monitor/log/index', icon: 'DocumentTextOutline', menuType: 1, sortNo: 2, keepAlive: 1 },
      ],
    }),
  },
  {
    url: '/api/v1/sys/menu/add',
    method: 'post',
    response: () => ({ code: '200', success: true, message: '新增成功' }),
  },
  {
    url: '/api/v1/sys/menu/edit',
    method: 'put',
    response: () => ({ code: '200', success: true, message: '编辑成功' }),
  },
  {
    url: '/api/v1/sys/menu/delete',
    method: 'delete',
    response: () => ({ code: '200', success: true, message: '删除成功' }),
  },
]
