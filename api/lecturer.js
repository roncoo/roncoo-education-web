import { getRequest, postRequest } from '@/utils/request'

export const lecturerApi = {
  // 讲师列表(搜索)
  lecturerList: (params = {}) => {
    return postRequest('/user/api/lecturer/search', params)
  },

  // 讲师详情
  lecturerDetail: (params = {}) => {
    return getRequest('/user/api/lecturer/view?id=' + params.id)
  }
}
