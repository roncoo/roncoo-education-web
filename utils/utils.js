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

export function getBrowserInfo() {
  /* eslint-disable */
  const Sys = {};
  const ua = navigator.userAgent.toLowerCase();
  let s;
  (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1]
    : (s = ua.match(/msie ([\d]+)/)) ? Sys.ie = s[1]
      : (s = ua.match(/edge\/([\d]+)/)) ? Sys.edge = s[1]
        : (s = ua.match(/firefox\/([\d]+)/)) ? Sys.firefox = s[1]
          : (s = ua.match(/(?:opera|opr).([\d]+)/)) ? Sys.opera = s[1] :
            (s = ua.match(/chrome\/([\d]+)/)) ? Sys.chrome = s[1] :
              (s = ua.match(/version\/([\d]+).*safari/)) ? Sys.safari = s[1] : 0;
  // 根据关系进行判断
  if (Sys.ie) return {name: 'IE', version: Sys.ie};
  if (Sys.edge) return {name: 'EDGE:', version: Sys.edge};
  if (Sys.firefox) return {name: 'Firefox:', version: Sys.firefox};
  if (Sys.chrome) return {name: 'Chrome:', version: Sys.chrome};
  if (Sys.opera) return {name: 'Opera:', version: Sys.opera};
  if (Sys.safari) return {name: 'Safari:', version: Sys.safari};
  return {name: 'Unkonwn', version: '0.0.0'};
}

// 获取系统信息
 export function getOsInfo() {
  const userAgent = navigator.userAgent.toLowerCase();
  let name = 'Unknown';
  let version = 'Unknown';
  if (userAgent.indexOf('win') > -1) {
    name = 'Windows';
    if (userAgent.indexOf('windows nt 5.0') > -1) {
      version = 'Windows 2000';
    } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
      version = 'Windows XP';
    } else if (userAgent.indexOf('windows nt 6.0') > -1) {
      version = 'Windows Vista';
    } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
      version = 'Windows 7';
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
      version = 'Windows 8';
    } else if (userAgent.indexOf('windows nt 6.3') > -1) {
      version = 'Windows 8.1';
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
      version = 'Windows 10';
    } else {
      version = 'Unknown';
    }
  } else if (userAgent.indexOf('iphone') > -1) {
    name = 'Iphone';
  } else if (userAgent.indexOf('mac') > -1) {
    name = 'Mac';
  } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
    name = 'Unix';
  } else if (userAgent.indexOf('linux') > -1) {
    if (userAgent.indexOf('android') > -1) {
      name = 'Android';
    } else {
      name = 'Linux';
    }
  } else {
    name = 'Unknown';
  }
  return {name, version};
}

/**
 * 深拷贝
 * @param param
 * @returns {any}
 */
export function deepCopy(param) {
  return JSON.parse(JSON.stringify(param))
}
