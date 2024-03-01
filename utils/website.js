// import { defineStore } from 'pinia'
// import { getSessionStorage, setSessionStorage } from '~/utils/storage.js'
// import { indexApi } from '~/api/index.js'
//
// function getInfo() {
//   let info = getSessionStorage('websiteInfo')
//   if (!info) {
//     indexApi.websiteInfo().then((res) => {
//       setSessionStorage('websiteInfo', res)
//       info = res
//     })
//   }
//   return info
// }
// function getNav() {
//   let nav = getSessionStorage('websiteNav')
//   if (!nav) {
//     indexApi.websiteNav().then((res) => {
//       setSessionStorage('websiteNav', res)
//       nav = res
//     })
//   }
//   return nav
// }
// function getLink() {
//   let link = getSessionStorage('websiteLink')
//   if (!link) {
//     indexApi.websiteLink().then((res) => {
//       setSessionStorage('websiteLink', res)
//       link = res
//     })
//   }
//   return link
// }
