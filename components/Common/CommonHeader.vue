<template>
  <el-header class="h_nav_fixed">
    <div class="h_nav">
      <div class="h_logo">
        <a href="/"><img v-if="info" :src="info.websiteLogo" alt="" /></a>
      </div>
      <ul v-if="nav" class="h_nav_ul clearfix">
        <li v-for="(item, index) in nav" :key="index">
          <a :class="{ active: activeUrl === item.navUrl }" :href="item.navUrl" :target="item.target">{{ item.navTitle }}</a>
        </li>
      </ul>
      <div class="search_box clearfix">
        <div class="clearfix">
          <button class="search_btn" @click="handleSearch">
            <span class="iconfont"></span>
          </button>
          <el-input v-model="search" placeholder="请输入搜索内容" @keydown.enter.stop="handleSearch" />
        </div>
      </div>
      <div v-if="userInfo" class="top_list">
        <el-dropdown>
          <span class="el-dropdown-link">
            <img src="../../assets/image/common_friend.jpg" alt="头像" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item><nuxt-link :to="{ name: 'account-course' }">我的课程</nuxt-link></el-dropdown-item>
              <el-dropdown-item><nuxt-link :to="{ name: 'account-collect' }">我的收藏</nuxt-link></el-dropdown-item>
              <el-dropdown-item><nuxt-link :to="{ name: 'account-order' }">我的订单</nuxt-link></el-dropdown-item>
              <el-dropdown-item><nuxt-link :to="{ name: 'account' }">个人信息</nuxt-link></el-dropdown-item>
              <el-dropdown-item @click="handleLogout">安全退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div v-if="!userInfo" class="login">
        <nuxt-link :to="{ name: 'login' }">登录</nuxt-link>
        <nuxt-link :to="{ name: 'register' }">注册</nuxt-link>
      </div>
    </div>
  </el-header>
</template>
<script setup>
  import { useWebsiteStore } from '~/store/modules/website.js'
  import { useUserStore } from '~/store/modules/user.js'
  import { ElMessageBox } from 'element-plus'

  const websiteStore = useWebsiteStore()
  const userStore = useUserStore()

  // 网站信息
  const info = ref({})
  // 导航
  const nav = ref([])
  // 搜索
  const search = ref('')
  // 用户信息
  const userInfo = ref()
  const activeUrl = ref('')

  onBeforeMount(() => {
    websiteStore.fetchInfo()
    websiteStore.fetchNav()
  })

  onMounted(() => {
    info.value = websiteStore.getInfo
    nav.value = websiteStore.getNav
    userInfo.value = userStore.getInfo
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
    z-index: 10;
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

    li {
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
      height: 60px;
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
