import http from './method'
// 获取手机验证码
export const getMobileCode = (params) => {
  return http().post('/user/api/user/send/code', params)
}
// 用户注册
export const register = (params={}) => {
  return http().post('/web/user/api/user/register', params)
}
// 用户登录
export const userLogin = (params={}) => {
  return http().post('/web/user/api/user/login', params)
}
// 用户登录
export const getUserInfo = (params={}) => {
  return http().post('/user/api/user/education/info/view', params)
}