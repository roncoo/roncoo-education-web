if (process.env.NODE_ENV == 'development') {
  module.exports =  {
    title: '领课学院',
    baseUrl: 'http://roncoo.vicp.net/api'   //java项目接口地址
  }
}else if (process.env.NODE_ENV == 'testing') {  
  module.exports =  {
    title: '领课学院',
    baseUrl: 'http://192.168.1.181:5840/api'  //java项目接口地址
  }
}else {
  module.exports =  {
    title: '领课学院',
    baseUrl: 'http://roncoo.vicp.net/api'   //java项目接口地址
  }
}
