import axios from 'axios'
import {serviceInfo, getNav, aboutList} from '~/api/main'
export default function ({route, req, res, store, next}) {
  let now = new Date();
  // console.log(route)
  if (!store.state.webInfo || now.getTime() - store.state.webInfo.time > 300000) {
    // 获取站点信息
    serviceInfo({moduleId: 3}).then(res => {
        // console.log(res.data)
        console.log("res.data==============")
      if (res.data.code  == 200) {
        res.data.data.time = now.getTime();
        store.commit('SET_ITEMS', {key: 'webInfo', value: res.data.data});
      } else{
        console.log(res.data)
      }
    }).catch(() => {
      console.log("获取站点信息失败")
    })
  }
  if (!store.state.navList || now.getTime() - store.state.navList.time > 500000) {
    // 获取导航信息
    getNav().then(res => {
        // console.log(res.data)
        // console.log('nav==============')
      if (res.data.code  == 200) {
        res.data.data.time = now.getTime();
        store.commit('SET_ITEMS', {key: 'navList', value: res.data.data});
      } else{
        console.log(res.data)
      }
    }).catch(() => {
      console.log("获取导航信息失败")
    })
  }
  // if (!store.state.aboutList || now.getTime() - store.state.aboutList.time > 500000) {
  //   // 获取关联信息
  //   aboutList().then(res => {
  //       // console.log(res.data)
  //       // console.log('about=================')
  //     if (res.data.code  == 200) {
  //       res.data.data.time = now.getTime();
  //       store.commit('SET_ITEMS', {key: 'aboutList', value: {time: now.getTime(), list: res.data.data.websiteNavList}});
  //     } else{
  //       console.log(res.data)
  //     }
  //   }).catch(() => {
  //     console.log("获取关联信息失败")
  //   })
  // }
  // axios.get('http://roncoo.iok.la/api/system/api/website/get/lingke')
  // .then(res => {
  //   console.log(res)
  //   console.log("res ==========")
  // })
}