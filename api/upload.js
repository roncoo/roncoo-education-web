import { upload } from '@/utils/request'

export const uploadApi = {
  // 上传图片
  uploadPic: (file) => {
    return upload('/system/auth/upload/pic', file)
  }
}
