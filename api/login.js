import http from './method'

// 用户登录
export const userLogin = (params = {}) => {
  return http().post('/user/api/users/login', params)
}
// 发送注册验证码
export const getMobileCode = (params) => {
  return http().post('/user/api/users/send/code', params)
}
// 用户注册
export const register = (params = {}) => {
  return http().post('/user/api/users/register', params)
}
// 修改密码
export const updatePassword = (params = {}) => {
  return http().post('/user/api/users/password', params)
}
