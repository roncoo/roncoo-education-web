import http from '../method.js'
// 课程审核列表
export const lecturerCourseList = (params={}) => {
  return http().post('/course/auth/course/audit/list', params)
}
// 课程上下架
export const coursePutaway = (params={}) => {
  return http().post('/course/auth/course/audit/stand', params)
}
// 删除课程
export const deleteCourse = (params={}) => {
  return http().post('/course/auth/course/audit/delete', params)
}
// 订单列表
export const orderList = (params={}) => {
  return http().post('/course/auth/order/info/list', params)
}
// 取消订单
export const orderClose = (params={}) => {
  return http().post('/course/auth/order/info/close', params)
}
// 订单继续支付
export const continuePay = (params={}) => {
  return http().post('/course/auth/order/info/continue/pay', params)
}
// 订单详情
export const orderInfo = (params={}) => {
  return http().post('/course/auth/order/info/view', params)
}
// 课程分类
export const infiniteCate = (params={}) => {
  return http().post('/course/api/course/category/list', params)
}
// 课程添加
export const saveCourseInfo = (params={}) => {
  return http().post('/course/auth/course/audit/save', params)
}
// 课程详情
export const courseDetail = (params={}) => {
  return http().post('/course/auth/course/audit/view', params)
}
// 更新课程信息
export const courseUpdate = (params={}) => {
  return http().post('/course/auth/course/audit/update', params)
}
// 课程章节列表
export const courseChapterList = (params={}) => {
  return http().post('/course/auth/course/chapter/audit/list', params)
}
// 添加课程章节
export const saveChapter = (params={}) => {
  return http().post('/course/auth/course/chapter/audit/save', params)
}
// 修改课程章节
export const updateChapter = (params={}) => {
  return http().post('/course/auth/course/chapter/audit/update', params)
}
// 删除课程章节
export const deleteChapter = (params={}) => {
  return http().post('/course/auth/course/chapter/audit/delete', params)
}
// 课程章节排序
export const chapterSort = (params={}) => {
  return http().post('/course/auth/course/chapter/audit/sort', params)
}
// 章节课时列表
export const chapterPraxisList = (params={}) => {
  return http().post('/course/auth/course/chapter/period/audit/list', params)
}
// 章节课时添加
export const savePraxis = (params={}) => {
  return http().post('/course/auth/course/chapter/period/audit/save', params)
}
// 章节课时更新
export const updatePraxis = (params={}) => {
  return http().post('/course/auth/course/chapter/period/audit/update', params)
}
// 章节课时删除
export const deletePraxis = (params={}) => {
  return http().post('/course/auth/course/chapter/period/audit/delete', params)
}
// 章节课时删除
export const updatePraxisSort = (params={}) => {
  return http().post('/course/auth/course/chapter/period/audit/sort', params)
}
// 章节视频库
export const chapterVideo = (params={}) => {
  return http().post('/course/auth/course/video/list/chapter', params)
}
// 章节视频添加
export const chapterVideoSave = (params={}) => {
  return http().post('/course/auth/course/video/save', params)
}
// 章节视频删除
export const chapterVideodel = (params={}) => {
  return http().post('/course/auth/course/video/delete', params)
}
// 课时视频
export const periodVideo = (params={}) => {
  return http().post('/course/auth/course/video/list/period', params)
}
// 课时视频更新
export const periodVideoUpdate = (params={}) => {
  return http().post('/course/auth/course/video/update', params)
}
