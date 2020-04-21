import http from '../method.js'

// 修改用户信息
export const updateUserEducationInf = (params={}) => {
  return http().post('/user/auth/user/ext/update', params)
}
// 获取讲师信息
export const getLecturerInfo = (params={}) => {
  return http().post('/user/auth/lecturer/view', params)
}
// 获取讲师审核信息
export const getLecturerInfoAudit = (params={}) => {
  return http().post('/user/auth/lecturer/audit/view', params)
}
// 修改讲师信息
export const updataLecturerInfoAudit = (params={}) => {
  return http().post('/user/auth/lecturer/audit/update', params)
}
// 修改密码
export const updatePassword = (params={}) => {
  return http().post('/user/api/user/update/password', params)
}
// 银行卡信息
export const cardInfo = (params={}) => {
  return http().post('/user/auth/lecturer/ext/view', params)
}
// 讲师订单收益
export const teacherOrderList = (params={}) => {
  return http().post('/course/auth/order/info/lecturer', params)
}
// 讲师提现记录
export const teacherCashList = (params={}) => {
  return http().post('/user/auth/lecturer/profit/list', params)
}
// 绑定银行卡
export const bindCard = (params={}) => {
  return http().post('/user/auth/lecturer/ext/update', params)
}
// 学习记录
export const studyList = (params={}) => {
  return http().post('/course/auth/course/user/study/log/list', params)
}
