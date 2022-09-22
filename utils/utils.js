/**
 * 格式化时长
 * @param mss
 * @returns {string}
 */
export const formatDuring = (mss) => {
  // const days = parseInt(mss / (1000 * 60 * 60 * 24));
  const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = parseInt((mss % (1000 * 60)) / 1000)
  if (hours > 0) {
    return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
  } else {
    return (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
  }
}

// 格式化大小
export function formatSize(limit) {
  let size = ''

  if (limit && limit !== 0) {
    if (limit < 0.1 * 1024) { // 小于0.1KB，则转化成B
      size = limit.toFixed(2) + 'B'
    } else if (limit < 0.1 * 1024 * 1024) { // 小于0.1MB，则转化成KB
      size = (limit / 1024).toFixed(2) + 'KB'
    } else if (limit < 0.1 * 1024 * 1024 * 1024) { // 小于0.1GB，则转化成MB
      size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
    } else if (limit < 0.1 * 1024 * 1024 * 1024 * 1024) { // 小于0.1TB，则转化成GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    } else { // 其他转化成GB
      size = (limit / (1024 * 1024 * 1024 * 1024)).toFixed(2) + 'TB'
    }
  }

  const sizeStr = size + '' // 转成字符串
  const index = sizeStr.indexOf('.') // 获取小数点处的索引
  const dou = sizeStr.substr(index + 1, 2) // 获取小数点后两位的值
  if (dou === '00') { // 判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return size
}

/**
 * 深拷贝
 * @param param
 * @returns {any}
 */
export function deepCopy(param) {
  return JSON.parse(JSON.stringify(param))
}
