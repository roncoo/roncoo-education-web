import { defineStore } from 'pinia'
import { getSessionStorage, setSessionStorage } from '~/utils/storage.js'
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
      this.info = getSessionStorage('websiteInfo')
      if (!this.info) {
        indexApi.websiteInfo().then((res) => {
          setSessionStorage('websiteInfo', res)
          this.info = res
        })
      }
    },
    fetchNav() {
      this.nav = getSessionStorage('websiteNav')
      if (!this.nav) {
        indexApi.websiteNav().then((res) => {
          setSessionStorage('websiteNav', res)
          this.nav = res
        })
      }
    },
    fetchLink() {
      this.link = getSessionStorage('websiteLink')
      if (!this.link) {
        indexApi.websiteLink().then((res) => {
          setSessionStorage('websiteLink', res)
          this.link = res
        })
      }
    }
  }
})
