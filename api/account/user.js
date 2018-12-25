import http from '../method.js'

// 修改用户信息
export const updateUserEducationInf = (params={}) => {
  return http().post('/auth/user/api/user/ext/update', params)
}