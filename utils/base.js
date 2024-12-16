import { KEYUTIL, KJUR } from 'jsrsasign'

export function getLiveStatusName(liveStatus) {
  if (liveStatus === 1) {
    return '待开播'
  } else if (liveStatus === 2) {
    return '直播中'
  } else if (liveStatus === 3) {
    return '待回放'
  } else if (liveStatus === 4) {
    return '观看回放'
  } else {
    return '未知'
  }
}

export function getResourceTypeName(resourceType) {
  if (resourceType === 1) {
    return '视频'
  } else if (resourceType === 2) {
    return '音频'
  } else if (resourceType === 3) {
    return '文档'
  } else if (resourceType === 4) {
    return '图片'
  } else if (resourceType === 5) {
    return '压缩包'
  } else {
    return '未知'
  }
}

/**
 * 判断是否是外部链接
 * @param path
 * @returns {boolean}
 */
export function isExternalUrl(path) {
  if (path.indexOf('http') != -1) {
    return true
  }
  return false
}

/**
 * 格式化时长
 * @param time
 */
export function formatTime(time) {
  let a = ~~(time / 3600)
  let b = ~~(time / 60) - a * 60
  let c = time % 60
  a = String(a).padStart(2, '0')
  b = String(b).padStart(2, '0')
  c = String(c).padStart(2, '0')
  if (a === '00') {
    return `${b}:${c}`
  } else {
    return `${a}:${b}:${c}`
  }
}

// 文件大小转换
export function transformSize(bytes) {
  // 文件大小转换
  const bt = parseInt(bytes)
  let result
  if (bt === 0) {
    result = '0B'
  } else {
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bt) / Math.log(k))
    if (typeof i !== 'number') {
      result = '-'
    } else {
      result = (bt / Math.pow(k, i)).toFixed(2) + sizes[i]
    }
  }
  return result
}

/**
 * 数字转换为中文
 * @param num
 * @returns {string}
 */
export function changeNumToHan(num) {
  const arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const arr2 = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿']
  if (!num || isNaN(num)) return '零'
  const english = num.toString().split('')
  let result = ''
  for (let i = 0; i < english.length; i++) {
    const des_i = english.length - 1 - i // 倒序排列设值
    result = arr2[i] + result
    const arr1_index = english[des_i]
    result = arr1[arr1_index] + result
  }
  result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十') // 将【零千、零百】换成【零】 【十零】换成【十】
  result = result.replace(/零+/g, '零') // 合并中间多个零为一个零
  result = result.replace(/零亿/g, '亿').replace(/零万/g, '万') // 将【零亿】换成【亿】【零万】换成【万】
  result = result.replace(/亿万/g, '亿') // 将【亿万】换成【亿】
  result = result.replace(/零+$/, '') // 移除末尾的零
  // 将【一十】换成【十】
  result = result.replace(/^一十/g, '十')
  return result
}

// 获取操作系统信息
export function getOsInfo() {
  const userAgent = navigator.userAgent
  let name = 'unknown'
  if (userAgent.indexOf('Windows Phone') > -1) {
    name = 'Windows Phone'
  } else if (userAgent.indexOf('Windows NT') > -1) {
    name = 'Windows'
  } else if (userAgent.indexOf('Mac') > -1) {
    name = 'Mac'
  } else if (userAgent.indexOf('X11') > -1) {
    name = 'UNIX'
  } else if (userAgent.indexOf('Linux') > -1) {
    name = 'Linux'
  } else if (userAgent.indexOf('iPhone') > -1) {
    name = 'iOS'
  } else if (userAgent.indexOf('iPad') > -1) {
    name = 'iOS'
  } else if (userAgent.indexOf('iPod') > -1) {
    name = 'iOS'
  } else if (userAgent.indexOf('Android') > -1) {
    name = 'Android'
  } else if (userAgent.indexOf('BlackBerry') > -1) {
    name = 'BlackBerry'
  } else if (userAgent.indexOf('webOS') > -1) {
    name = 'webOS'
  }
  return name
}

/**
 * 获取浏览器信息
 * @returns {{name: string, version: string}}
 */
export function getBrowserInfo() {
  const Sys = {}
  const ua = navigator.userAgent.toLowerCase()
  let s
  ;(s = ua.match(/rv:([\d.]+)\) like gecko/))
    ? (Sys.ie = s[1])
    : (s = ua.match(/msie ([\d]+)/))
      ? (Sys.ie = s[1])
      : (s = ua.match(/edge\/([\d]+)/))
        ? (Sys.edge = s[1])
        : (s = ua.match(/firefox\/([\d]+)/))
          ? (Sys.firefox = s[1])
          : (s = ua.match(/(?:opera|opr).([\d]+)/))
            ? (Sys.opera = s[1])
            : (s = ua.match(/chrome\/([\d]+)/))
              ? (Sys.chrome = s[1])
              : (s = ua.match(/version\/([\d]+).*safari/))
                ? (Sys.safari = s[1])
                : 0
  // 根据关系进行判断
  if (Sys.ie) return { name: 'IE', version: Sys.ie }
  if (Sys.edge) return { name: 'EDGE', version: Sys.edge }
  if (Sys.firefox) return { name: 'Firefox', version: Sys.firefox }
  if (Sys.chrome) return { name: 'Chrome', version: Sys.chrome }
  if (Sys.opera) return { name: 'Opera', version: Sys.opera }
  if (Sys.safari) return { name: 'Safari', version: Sys.safari }
  return { name: 'Unkonwn', version: '0.0.0' }
}

export function encrypt(password, publicKey) {
  publicKey = `-----BEGIN PUBLIC KEY-----\n` + publicKey + `\n-----END PUBLIC KEY-----`
  return KJUR.crypto.Cipher.encrypt(password, KEYUTIL.getKey(publicKey))
}
