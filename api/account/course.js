import http from '../method.js'
// 课程审核列表
export const lecturerCourseList = (params={}) => {
  return http().post('/auth/course/api/course/audit/list', params)
}
// 课程上下架
export const coursePutaway = (params={}) => {
  return http().post('/auth/course/api/course/audit/stand', params)
}
// 删除课程
export const deleteCourse = (params={}) => {
  return http().post('/auth/course/api/course/audit/delete', params)
}
// 订单列表
export const orderList = (params={}) => {
  return http().post('/auth/course/api/order/info/list', params)
}
// 取消订单
export const orderClose = (params={}) => {
  return http().post('/auth/course/api/order/info/close', params)
}
// 订单继续支付
export const continuePay = (params={}) => {
  return http().post('/auth/course/api/order/info/continue/pay', params)
}
// 订单详情
export const orderInfo = (params={}) => {
  return http().post('/auth/course/api/order/info/view', params)
}
// 课程分类
export const infiniteCate = (params={}) => {
  return http().post('/course/api/course/category/list', params)
}
// 课程添加
export const saveCourseInfo = (params={}) => {
  return http().post('/auth/course/api/course/audit/save', params)
}
// 课程详情
export const courseDetail = (params={}) => {
  return http().post('/auth/course/api/course/audit/view', params)
}
// 更新课程信息
export const courseUpdate = (params={}) => {
  return http().post('/auth/course/api/course/audit/update', params)
}
