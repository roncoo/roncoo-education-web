module.exports = {
  apps: [{
    name: 'web', // 名称
    script: '.output/server/index.mjs',
    instances: '1' // 进程数，若为：max，指当前服务器cpu核数
  }]
}
