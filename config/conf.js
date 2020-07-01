if (process.env.NODE_ENV == 'development') { //开发环境
  module.exports =  {
    title: '领课教育系统(开源版)-打造全行业都适用的在线教育系统',
    baseUrl: 'http://127.0.0.1:5840/api'   //java项目接口地址
  }
}else if (process.env.NODE_ENV == 'testing') {  //测试环境
  module.exports =  {
    title: '领课教育系统(开源版)-打造全行业都适用的在线教育系统',
    baseUrl: 'http://127.0.0.1:5840/api'  //java项目接口地址
  }
}else { //默认生产环境
  module.exports =  {
    title: '领课教育系统(开源版)-打造全行业都适用的在线教育系统',
    baseUrl: 'http://127.0.0.1:5840/api'   //java项目接口地址
  }
}
