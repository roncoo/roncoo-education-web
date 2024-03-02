import { defineStore } from 'pinia'
import { getStore, setStore } from '~/utils/storage.js'
import { indexApi } from '~/api/index.js'

export const useWebsiteStore = defineStore({
  id: 'website',
  state: () => ({
    info: {},
    nav: [],
    link: []
  }),
  getters: {
    getInfo() {
      return this.info
    },
    getNav() {
      return this.nav
    },
    getLink() {
      return this.link
    }
  },
  actions: {
    fetchInfo() {
      this.info = getStore('websiteInfo')
      console.log(this.info)
      if (!this.info) {
        indexApi.websiteInfo().then((res) => {
          setStore('websiteInfo', res)
          this.info = res
        })
      }
    },
    fetchNav() {
      this.nav = getStore('websiteNav')
      if (!this.nav) {
        indexApi.websiteNav().then((res) => {
          setStore('websiteNav', res)
          this.nav = res
        })
      }
    },
    fetchLink() {
      this.link = getStore('websiteLink')
      if (!this.link) {
        indexApi.websiteLink().then((res) => {
          setStore('websiteLink', res)
          this.link = res
        })
      }
    }
  }
})
