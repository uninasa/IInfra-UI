/**
 * 权限菜单 Mock 接口
 * 模拟后端返回的动态菜单 + 按钮权限数据
 */
export default [
  {
    url: '/api/v1/sys/permission/queryPermissionsByUser',
    method: 'get',
    response: () => ({
      code: '200',
      success: true,
      result: {
        // ==================== 菜单数据 ====================
        menu: [
          {
            path: '/dashboard',
            name: 'Dashboard',
            component: 'dashboard/index',
            meta: {
              title: '工作台',
              icon: 'BarChartOutline',
              keepAlive: false,
              hidden: false,
            },
          },
          {
            path: '/system',
            name: 'System',
            component: 'Layout',
            meta: {
              title: '系统管理',
              icon: 'SettingsOutline',
              keepAlive: false,
              hidden: false,
            },
            children: [
              {
                path: '/system/user',
                name: 'SystemUser',
                component: 'system/user/index',
                meta: {
                  title: '用户管理',
                  icon: 'PeopleOutline',
                  keepAlive: true,
                  permissionList: [
                    { action: 'user:add', describe: '新增' },
                    { action: 'user:edit', describe: '编辑' },
                    { action: 'user:delete', describe: '删除' },
                    { action: 'user:list', describe: '查询' },
                  ],
                },
              },
              {
                path: '/system/role',
                name: 'SystemRole',
                component: 'system/role/index',
                meta: {
                  title: '角色管理',
                  icon: 'ShieldOutline',
                  keepAlive: true,
                  permissionList: [
                    { action: 'role:add', describe: '新增' },
                    { action: 'role:edit', describe: '编辑' },
                    { action: 'role:delete', describe: '删除' },
                    { action: 'role:list', describe: '查询' },
                  ],
                },
              },
              {
                path: '/system/menu',
                name: 'SystemMenu',
                component: 'system/menu/index',
                meta: {
                  title: '菜单管理',
                  icon: 'MenuOutline',
                  keepAlive: true,
                  permissionList: [
                    { action: 'menu:add', describe: '新增' },
                    { action: 'menu:edit', describe: '编辑' },
                    { action: 'menu:delete', describe: '删除' },
                    { action: 'menu:list', describe: '查询' },
                  ],
                },
              },
            ],
          },
          {
            path: '/monitor',
            name: 'Monitor',
            component: 'Layout',
            meta: {
              title: '运维监控',
              icon: 'PulseOutline',
              keepAlive: false,
              hidden: false,
            },
            children: [
              {
                path: '/monitor/server',
                name: 'MonitorServer',
                component: 'monitor/server/index',
                meta: {
                  title: '服务器监控',
                  icon: 'ServerOutline',
                  keepAlive: false,
                  permissionList: [],
                },
              },
              {
                path: '/monitor/log',
                name: 'MonitorLog',
                component: 'monitor/log/index',
                meta: {
                  title: '操作日志',
                  icon: 'DocumentTextOutline',
                  keepAlive: true,
                  permissionList: [],
                },
              },
            ],
          },
        ],

        // ==================== 当前用户按钮权限 ====================
        auth: [
          { action: 'dashboard:view', type: '1', describe: '工作台查看' },
          { action: 'user:list', type: '1', describe: '用户查询' },
          { action: 'user:add', type: '1', describe: '用户新增' },
          { action: 'user:edit', type: '1', describe: '用户编辑' },
          { action: 'user:delete', type: '1', describe: '用户删除' },
          { action: 'role:list', type: '1', describe: '角色查询' },
          { action: 'role:add', type: '1', describe: '角色新增' },
          { action: 'role:edit', type: '1', describe: '角色编辑' },
          { action: 'menu:list', type: '1', describe: '菜单查询' },
        ],

        // ==================== 全量权限（用于流程节点） ====================
        allAuth: [
          { action: 'dashboard:view', type: '1' },
          { action: 'user:list', type: '1' },
          { action: 'user:add', type: '1' },
          { action: 'user:edit', type: '1' },
          { action: 'user:delete', type: '1' },
          { action: 'role:list', type: '1' },
          { action: 'role:add', type: '1' },
          { action: 'role:edit', type: '1' },
          { action: 'role:delete', type: '1' },
          { action: 'menu:list', type: '1' },
          { action: 'menu:add', type: '1' },
          { action: 'menu:edit', type: '1' },
          { action: 'menu:delete', type: '1' },
        ],
      },
    }),
  },
]
