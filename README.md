## roncoo-education-web  领课在线教育系统

> nuxtjs + koa2 + vue2.0 + vuex 搭建的服务端渲染在线教育类网站前端项目
>  github项目地址: [https://github.com/roncoo/roncoo-education-web](https://github.com/roncoo/roncoo-education-web) 
>  前端演示地址: [前端演示](http://edu.os.roncoo.com/)
>  后台演示地址: [管理后台](http://roncoo.vicp.net/boss/login)

#### 项目介绍
>领课在线教育系统是基于领课教育团队多年的在线教育系统开发和运营经验开发的一套全行业都适用的在线教育系统,采用主流技术,即取即可用,大大降低了企业部署上线和二次开发成本!

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

# generate static project
$ npm run generate
```
