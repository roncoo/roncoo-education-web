<template>
  <el-header>
    <div class="top">
      <div v-if="nav" class="top-nav">
        <a href="/"><img v-if="info" :src="info.websiteLogo" alt="" /></a>
        <div v-for="(item, index) in nav" :key="index" class="top-nav-title">
          <nuxt-link v-if="!isExternalUrl(item.navUrl)" :to="{ path: item.navUrl }" :class="{ active: activeUrl === item.navUrl }">
            {{ item.navTitle }}
          </nuxt-link>
          <a v-else :href="item.navUrl" :target="item.target">{{ item.navTitle }}</a>
        </div>
      </div>
      <div v-if="pathUrl != '/search'" class="top-search">
        <el-input v-model="search" autofocus placeholder="请输入搜索内容" @keyup.enter="handleSearch">
          <template #prefix>
            <img src="~/assets/svg/search.svg" />
          </template>
        </el-input>
      </div>
      <div class="top-user">
        <div v-if="loginStatus">
          <common-user />
        </div>
        <div v-else>
          <nuxt-link :to="{ name: 'login' }"> 登录 </nuxt-link>
          <nuxt-link :to="{ name: 'register' }"> 注册 </nuxt-link>
        </div>
      </div>
    </div>
  </el-header>
</template>
<script setup>
  import { indexApi } from '~/api/index.js'
  import { getStorage, setStorage } from '~/utils/storage.js'

  // 网站信息
  const info = ref({})
  // 导航信息
  const nav = ref([])
  //
  const loginStatus = ref(false)

  // 搜索
  const pathUrl = useRoute().path
  const search = ref('')
  const activeUrl = ref(useRoute().path)

  onMounted(() => {
    // 站点信息
    info.value = getStorage('WebsiteInfo')
    if (!info.value) {
      indexApi.websiteInfo().then((res) => {
        setStorage('WebsiteInfo', res, 60)
        info.value = res
      })
    }

    // 导航信息
    nav.value = getStorage('WebsiteNav')
    if (!nav.value) {
      indexApi.websiteNav().then((res) => {
        setStorage('WebsiteNav', res, 60)
        nav.value = res
      })
    }
    const token = getToken()
    if (token) {
      loginStatus.value = true
    }
  })

  // 搜索
  function handleSearch() {
    useRouter().push({ name: 'search', query: { kw: search.value } })
  }
</script>
<style lang="scss" scoped>
  .el-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 999;
    height: 70px;
    display: flex;
    justify-content: center;
    border: 1px solid #ebeef5;
  }

  .active {
    color: #46c37b;
  }

  .top {
    width: 1200px;
    min-width: 1200px;
    height: 70px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .top-nav {
      display: flex;
      align-items: center;
      .top-nav-title {
        margin-left: 30px;
        font-size: 18px;
      }

      //.top-nav-title:last-child {
      //  border-radius: 10px;
      //  color: #fff;
      //  border-color: #46c37b;
      //  background-color: #46c37b;
      //  padding: 8px 10px;
      //}
    }

    .top-search {
      .el-input {
        height: 35px;
        line-height: 35px;
      }
      img {
        width: 20px;
      }
    }

    .top-user {
      img {
        border-radius: 50%;
      }
      a {
        font-size: 16px;
        margin-left: 10px;
      }
    }

    img {
      height: 35px;
      width: auto;
    }
  }
</style>
