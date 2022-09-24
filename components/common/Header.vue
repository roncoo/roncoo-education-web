<template>
  <div class="h_header">
    <div class="h_nav">
      <div class="h_logo">
        <a :href="mainUrl">
          <img v-if="websiteInfo" :src="websiteInfo.websiteLogo" alt="">
        </a>
      </div>
      <ul v-show="navList" class="h_nav_ul clearfix">
        <li v-for="(item, index) in navList" :key="index">
          <a :class="{active: isNow === item.navUrl}" :href="item.navUrl" :target="item.target">{{ item.navTitle }}</a>
        </li>
      </ul>
      <div v-show="!hideTop" class="search_box clearfix">
        <div class="clearfix">
          <button class="search_btn" @click="handleSearch">
            <span class="iconfont"></span>
          </button>
          <input v-model="search" type="text" class="search_input" placeholder="请输入搜索内容" @keydown.enter.stop="handleSearch">
        </div>
      </div>
      <ul v-show="userInfo" class="top_list">
        <li>
          <nuxt-link :to="{name: 'account-course'}">我的课程</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{name: 'account'}">{{ userInfo.mobile }}</nuxt-link>
        </li>
        <li><a href="javascript:" @click="signOut">退出</a></li>
      </ul>
      <ul v-if="!hideTop" v-show="!userInfo" class="top_list ">
        <li class=""><a href="javascript:" @click="login">登录</a></li>
        <li><a href="javascript:" @click="register">注册</a></li>
      </ul>
    </div>
  </div>
</template>
<script>
import bq from 'bq-static'

export default {
  props: {
    active: {
      type: String,
      default: ''

    },
    hideTop: {
      type: Boolean,
      default: false
    },
    hideSearch: {
      type: Boolean,
      default: false
    },
    searchText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isNow: '',
      search: '',
      userInfo: '',
      websiteInfo: this.$store.state.websiteInfo,
      mainUrl: this.$store.state.mainUrl,
      navList: this.$store.state.navList
    }
  },
  mounted() {
    bq()
    this.search = this.searchText
    this.isNow = this.$route.path
    this.userInfo = this.$store.state.userInfo
  },
  methods: {
    handleSearch() {
      this.$router.push({ name: 'search', query: { search: this.search }})
    },
    signOut() {
      this.$store.commit('SIGN_OUT')
      this.userInfo = ''
      if (this.$route.path.includes('account')) {
        this.$router.push({ name: 'login' })
      } else {
        window.location.reload()
      }
    },
    login() {
      this.$store.commit('SET_TEMPORARYURL')
      this.$router.push({ name: 'login' })
    },
    register() {
      this.$router.push({ name: 'login', query: { tab: 2 }})
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.h_header {
  background: #fff;
}

.top_list {
  float: right;

  li {
    float: left;
    font-size: 18px;
    margin-top: 25px;
    padding: 0px 20px 0px 0px;
    position: relative;

    a {

      &:hover {
        text-decoration: none;
        color: red;
      }

      &.c_gold {
        color: #CA9E70;
      }
    }

    &.s_left {
      border-left: 1px solid #ccc;
      padding-left: 10px;
    }
  }
}

.h_nav {
  width: 1200px;
  margin: 0 auto;
  height: 70px;
  position: relative;

  .go_index {
    position: absolute;
    right: 10px;
    bottom: 20px;
  }
}

.h_logo {
  display: inline-block;
  position: absolute;
  top: 15px;
  // left: 20px;
  img {
    height: 42px;
  }
}

.search_box {
  display: inline-block;
  position: relative;
  top: -32px;
  right: -40px;
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

.search_input {
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  color: #333;
  border: none;
  width: 100%;
  padding-left: 42px;
  padding-right: 12px;
  border-radius: 20px;
  background-color: #f7f8fa;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.clearfix {
  &:before {
    content: "";
    display: table;
  }

  &:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
</style>
