module.exports = {
  apps: [{
    name: 'web', // 名称
    script: './node_modules/nuxt/bin/nuxt.js',
    args: 'start',
    instances: '1' // 进程数，若为：max，指当前服务器cpu核数
  }]
}
