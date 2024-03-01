import { getRequest, postRequest } from '@/utils/request'

export const indexApi = {
  // 首页轮播图
  carouselList: () => {
    return getRequest('/system/api/website/carousel/list')
  },
  // 分类列表
  categoryList: () => {
    return getRequest('/course/api/category/list')
  },
  // 专区课程
  zoneList: (params = {}) => {
    return postRequest('/course/api/zone/list', params)
  },
  // 首页导航栏
  websiteNav: () => {
    return getRequest('/system/api/website/nav/list')
  },
  // 站点信息
  websiteInfo: () => {
    return getRequest('/system/api/sys/config/website')
  },
  // 友情链接
  websiteLink: () => {
    return getRequest('/system/api/website/link/list')
  }
}
