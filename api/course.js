import { getRequest, postRequest } from '@/utils/request'

export const courseApi = {
  categoryList: () => {
    return getRequest('/course/api/category/list')
  },

  // 课程列表(搜索)
  courseList: (params = {}) => {
    return postRequest('/course/api/course/search', params)
  },

  // 课程详情
  courseDetail: (params = {}) => {
    return postRequest('/course/api/course/view', params)
  },

  // 课程评论列出
  courseCommentPage: (params = {}) => {
    return postRequest('/course/api/course/comment', params)
  },

  // 课程详情(登录后)
  userCourseDetail: (params = {}) => {
    return postRequest('/course/auth/course/view', params)
  },

  // 获取播放sign
  studySign: (params = {}) => {
    return postRequest('/course/auth/course/sign', params)
  },

  // 同步学习进度
  studyProgress: (params = {}) => {
    return postRequest('/course/api/user/study/progress', params)
  },

  // 创建订单
  createOrder: (params = {}) => {
    return postRequest('/user/auth/order/pay/create', params)
  },

  // 订单信息
  orderInfoView: (orderNo) => {
    return getRequest('/user/auth/order/info/view?orderNo=' + orderNo)
  },

  // 课程评论添加
  courseCommentAdd: (params = {}) => {
    return postRequest('/course/auth/user/course/comment/add', params)
  },

  // 课程收藏添加
  courseCollectAdd: (params = {}) => {
    return postRequest('/course/auth/user/course/collect/add', params)
  }
}
