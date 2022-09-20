import http from './method.js'

// 分类列表
export const categoryList = () => {
  return http().get('/course/api/category/list')
}
// 首页推荐课程
export const zoneList = (params = {}) => {
  return http().post('/course/api/zone/list', params)
}
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
  return http().get('/system/api/website/carousel/list')
}
// 友情链接
export const linkList = () => {
  return http().get('/system/api/website/link/list')
}

