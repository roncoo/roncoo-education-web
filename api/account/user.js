import http from '../method.js'

// 修改用户信息
export const updateUserEducationInf = (params={}) => {
  return http().post('/auth/user/api/user/ext/update', params)
}
// 获取讲师信息
export const getLecturerInfo = (params={}) => {
  return http().post('/auth/user/api/lecturer/audit/view', params)
}
// 修改讲师信息
export const updataLecturerInfo = (params={}) => {
  return http().post('/auth/user/api/lecturer/audit/update', params)
}
// 修改密码
export const updatePassword = (params={}) => {
  return http().post('/user/api/user/update/password', params)
}
