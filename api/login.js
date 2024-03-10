import { postRequest, getRequest } from '@/utils/request'

export const loginApi = {
  // 用户登录
  userLogin: (params = {}) => {
    return postRequest('/user/api/users/login', params)
  },
  getCodeImg: () => {
    return getRequest('/system/api/common/code')
  },
  // 发送注册验证码
  getMobileCode: (params) => {
    return postRequest('/user/api/users/send/code', params)
  },
  // 用户注册
  register: (params = {}) => {
    return postRequest('/user/api/users/register', params)
  },
  // 修改密码
  updatePassword: (params = {}) => {
    return postRequest('/user/api/users/password', params)
  }
}
