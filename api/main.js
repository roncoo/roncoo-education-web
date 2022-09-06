import http from './method.js'

// 分类列表
export const categoryList = () => {
  return http().get('/course/api/category/list')
}

// 首页推荐课程
export const zoneList = (params = {}) => {
  return http().post('/course/api/zone/list', params)
}
// 关于我们列表
// export const aboutList = (params = {}) => {
//   return http().get('/system/api/website/article/list', params)
// }
// // 关于我们信息
// export const aboutInfo = (params = {}) => {
//   return http().post('/system/api/website/nav/article/get', params)
// }
// 站点信息
export const websiteInfo = () => {
  return http().get('/system/api/sys/config/website')
}
// 首页导航栏
export const navList = () => {
  return http().get('/system/api/website/nav/list')
}
// 首页轮播图
export const carouselList = () => {
  return http().get('/system/api/website/adv/list')
}
// 友情链接
export const linkList = () => {
  return http().get('/system/api/website/link/list')
}
// // 招募内容
// export const recruitInfo = (params = {}) => {
//   return http().post('/system/api/website/recruit/get', params)
// }
