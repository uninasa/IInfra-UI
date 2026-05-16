/**
 * 用户相关 Mock 接口
 */
export default [
  // ==================== 登录 ====================
  {
    url: '/api/v1/sys/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body

      if (password !== '123456') {
        return { code: '500', success: false, message: '用户名或密码错误' }
      }

      const userMap = {
        admin: {
          token: 'mock-token-admin-' + Date.now(),
          userInfo: {
            id: '1',
            username: 'admin',
            realname: '超级管理员',
            avatar: '',
            email: 'admin@iinfra.com',
          },
          roles: ['admin'],
        },
        test: {
          token: 'mock-token-test-' + Date.now(),
          userInfo: {
            id: '2',
            username: 'test',
            realname: '测试用户',
            avatar: '',
            email: 'test@iinfra.com',
          },
          roles: ['test'],
        },
      }

      const user = userMap[username] || userMap['test']

      return {
        code: '200',
        success: true,
        message: '登录成功',
        result: {
          ...user,
          tenantList: [{ id: '1', name: '默认租户' }],
          subSystem: false,
        },
      }
    },
  },

  // ==================== 退出登录 ====================
  {
    url: '/api/v1/sys/logout',
    method: 'post',
    response: () => ({
      code: '200',
      success: true,
      message: '退出成功',
    }),
  },

  // ==================== 获取用户信息 ====================
  {
    url: '/api/v1/sys/user/info',
    method: 'get',
    response: () => ({
      code: '200',
      success: true,
      result: {
        id: '1',
        username: 'admin',
        realname: '超级管理员',
        avatar: '',
        email: 'admin@iinfra.com',
      },
    }),
  },
]
