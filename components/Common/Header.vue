<template>
  <el-header class="h_nav_fixed">
    <div class="h_nav">
      <div class="h_logo">
        <a href="/"><img v-if="info" :src="info.websiteLogo" alt="" /></a>
      </div>
      <div v-if="nav" class="h_nav_ul clearfix">
        <div v-for="(item, index) in nav" :key="index" class="nav">
          <a :class="{ active: activeUrl === item.navUrl }" :href="item.navUrl" :target="item.target">{{ item.navTitle }}</a>
        </div>
      </div>
      <div class="search_box clearfix">
        <div class="clearfix">
          <button class="search_btn" @click="handleSearch">
            <span class="iconfont"></span>
          </button>
          <el-input v-model="search" autofocus placeholder="请输入搜索内容" @keydown.enter.stop="handleSearch" />
        </div>
      </div>
      <div v-if="userInfo" class="top_list">
        <el-dropdown>
          <span class="el-dropdown-link">
            <img src="../../assets/image/common_head.jpg" alt="头像" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <nuxt-link :to="{ name: 'account-course' }"> 我的课程 </nuxt-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <nuxt-link :to="{ name: 'account-collect' }"> 我的收藏 </nuxt-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <nuxt-link :to="{ name: 'account-order' }"> 我的订单 </nuxt-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <nuxt-link :to="{ name: 'account-user' }"> 个人信息 </nuxt-link>
              </el-dropdown-item>
              <el-dropdown-item @click="handleLogout"> 安全退出 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div v-if="!userInfo" class="login">
        <nuxt-link :to="{ name: 'login' }"> 登录 </nuxt-link>
        <nuxt-link :to="{ name: 'register' }"> 注册 </nuxt-link>
      </div>
    </div>
  </el-header>
</template>
<script setup>
  import { ElMessageBox } from 'element-plus'
  import { indexApi } from '~/api/index.js'
  import { userApi } from '~/api/user.js'
  import { useUserStore } from '~/store/modules/user.js'
  import { getStorage, setStorage } from '~/utils/storage.js'

  const userStore = useUserStore()

  // 网站信息
  const info = ref({})
  // 导航信息
  const nav = ref([])
  // 用户信息
  const userInfo = ref()

  // 搜索
  const search = ref('')
  const activeUrl = ref('')

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

    if (getToken()) {
      userApi.getUserInfo().then((res) => {
        userInfo.value = res
      })
    }
  })

  // 搜索
  function handleSearch() {
    useRouter().push({ name: 'search', query: { search: search.value } })
  }

  // 退出登录
  function handleLogout() {
    ElMessageBox.confirm('确认退出', '退出登录', {
      confirmButtonText: '确认',
      showCancelButton: false,
      type: 'warning'
    }).then(() => {
      userStore.logout()
      location.reload()
    })
  }
</script>
<style lang="scss" scoped>
  .h_nav_fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 100;
    height: 70px;
  }

  .h_nav {
    width: 1200px;
    margin: 0 auto;
    height: 70px;
  }

  .h_logo {
    display: inline-block;
    position: absolute;
    top: 15px;
    img {
      height: 40px;
    }
  }

  .search_box {
    display: inline-block;
    position: relative;
    top: -32px;
    right: -150px;
    width: 200px;
    height: 40px;
    margin: 13px 0 0;
  }

  .h_nav_ul {
    display: inline-block;
    margin-left: 220px;

    .nav {
      float: left;
      height: 70px;
      line-height: 70px;
      font-size: 18px;
      padding: 0 15px;

      .active {
        color: red;
      }

      a:hover {
        color: red;
        text-decoration: none;
      }
    }

    li:last-child {
      border-radius: 40px;
      color: #fff;
      border-color: #46c37b;
      background-color: #46c37b;
      height: 40px;
      line-height: 40px;
      margin-top: 15px;
      margin-left: 20px;
      font-size: 16px;
      a {
        color: #fff;
      }
    }
  }
  .top_list {
    float: right;
    img {
      height: 50px;
      border-radius: 50%;
    }
  }
  .search_btn {
    position: absolute;
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    background: #fff;
    border: 0;
    left: 5px;
    top: 2px;
    background: none;
    width: 35px;
    font-size: 14px;
    outline: none;

    .iconfont {
      font-size: 24px;
      color: #333;
    }
  }

  .clearfix {
    &:before {
      content: '';
      display: table;
    }
    &:after {
      content: '';
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
  }

  .login {
    float: right;
    font-size: 16px;
  }
</style>
