# roncoo-education-web - 领课教育（roncoo-education）

#### 项目介绍
领课教育系统（roncoo-education）是基于领课网络多年的在线教育平台开发和运营经验打造出来的产品，致力于打造一个全行业都适用的分布式在线教育系统。系统采用前后端分离模式，前台采用vue.js为核心框架，后台采用Spring Cloud为核心框架。系统目前主要功能有课程点播功能，支持多家视频云的接入，课程附件设置功能，支持多家云存储的接入，讲师管理功能，支持讲师入驻功能，可以帮助个人或者企业快速实现一个轻量级的在线教育平台。

### 项目说明
> nuxtjs + koa2 + vue2.0 + vuex 搭建的服务端渲染在线教育类网站前端项目

### 演示地址
##### 前端演示地址：[领课教育](http://edu.os.roncoo.com/) | 后台演示地址：[管理后台](http://roncoo.vicp.net/boss/login)

### 相关工程
##### 项目工程（roncoo-education）：[码云地址](https://gitee.com/roncoocom/roncoo-education) | [Github地址](https://github.com/roncoo/roncoo-education)

### 使用文档
##### [项目介绍](https://blog.roncoo.com/article/1105321762337357826) | [部署文档](https://blog.roncoo.com/article/1103554925858197505) | [常见问题](https://blog.roncoo.com/article/1105309620724858882)

### 官方QQ群（加群免费获取sql脚本）
<a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=7d1b7f1a78715320d09ed841c66d6bf0fa7b9105964cc327e9483e459b46abd4"><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" alt="在线教育系统-领课" title="在线教育系统-领课"> 826617734</a>

### 商业合作
* 如果想使用教育系统，我们商业版功能更强大！
* 如果想定制教育系统，我们提供有偿服务支持！
* 如果想运营教育平台，我们提供Saas云服务！
* 支持其他合作方式，欢迎来撩！
* 商业合作联系QQ：513781560 
* 官网地址：[https://edu.roncoo.net](https://edu.roncoo.net/index.html)

#### 目录结构
``` 
roncoo-education-web/
├── api/ api接口列表目录
│   ├── method.js
│   ├── main.js
├── assets/ 公用的静态资源目录
│   ├── CSS/
│   ├── JS
│   ├── fonts
│   ├── image
├── component/ 
│   ├── 所有的自定义组件
├── config/ 配置文件目录
│   ├── conf.js  系统编译配置文件
│   ├── index.js  系统全局配置文件
│   ├── dev.env.js  开发模式的全局配置
│   ├── pro.env.js  生产模式的全局配置
│   ├── index.js  测试模式的全局配置
├── layouts/
│   ├── 布局目录
├── middleware/
│   ├── 中间件目录
├── pages/
│   ├── 页面目录
├── plugins/
│   ├── 所有的第三方或自定义插件的目录
├── static/
│   ├── 静态文件目录
├── store/
│   ├── actions.js
│   ├── getters.js
│   ├── index.js
│   ├── mutations.js
├── utils/
│   ├── 自定义工具类目录
└── next.config.js   nextjs 配置文件 
```



#### 编译使用
``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

```
