<template>
  <header class="side_box">
    <div v-if="teacher" class="menu_panel">
      <h3 class="title"><i class="iconfont">&#xe640;</i>讲师中心</h3>
      <ul class="menus">
        <li :class="{on: type == 'kcgl'}">
          <router-link :to="{name: 'account-teacher-course'}">课程管理</router-link>
        </li>
        <li v-if="userInfo && userInfo.userType != 1" :class="{on: type == 'syqk'}">
          <router-link :to="{name: 'account-earnings'}">收益情况</router-link>
        </li>
        <li :class="{on: type == 'jsxx'}">
          <router-link :to="{name: 'account-teacher'}">讲师信息</router-link>
        </li>
      </ul>
    </div>
    <div class="menu_panel">
      <h3 class="title"><i class="iconfont">&#xe60a;</i>个人资料</h3>
      <ul class="menus">
        <li :class="{on: type == 'xxjl'}">
          <router-link :to="{name: 'account-study'}">学习记录</router-link>
        </li>
        <li :class="{on: type == 'wddd'}">
          <router-link :to="{name: 'account-order'}">我的订单</router-link>
        </li>
        <li :class="{on: type == 'xgmm'}">
          <router-link :to="{name: 'account-reset'}">修改密码</router-link>
        </li>
        <li :class="{on: type == 'grxx'}">
          <router-link :to="{name: 'account'}">个人信息</router-link>
        </li>
      </ul>
    </div>
  </header>
</template>
<script>
import bq from 'bq-static'
import { getUserInfo } from '~/api/user.js'

export default {
  props: {
    type: {
      type: String,
      default: 'grxx'
    }
  },
  data() {
    return {
      teacher: false,
      isLive: false,
      isLibrary: false,
      isCourse: false,
      isResource: false,
      websiteInfo: this.$store.state.websiteInfo,
      tokenInfo: this.$store.state.tokenInfo,
      userInfo: this.$store.state.userInfo
    }
  },
  mounted() {
    bq()
    if (this.tokenInfo && this.userInfo && this.userInfo.token === this.tokenInfo) {
      if (this.userInfo.userType === 2 || this.userInfo.userType === 4) {
        this.teacher = true
      }
    } else {
      getUserInfo().then(res => {
        const result = res.data
        if (result.code === 200) {
          if (result.data.userType === 2 || result.data.userType === 4) {
            this.teacher = true
          }
        }
      })
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.side_box {
  border-radius: 6px 6px 0 0;
  float: left;
  width: 168px;
}

.menu_panel {
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 6px 6px 0 0;

  .act_icon {
    width: 16px;
    margin-right: 2px;
  }

  .title {
    font-size: 14px;
    color: #333;
    line-height: 60px;
    padding: 0 35px;
    border-bottom: 1px solid rgb(242, 242, 242);

    i {
      padding-right: 6px;
      font-size: 16px;
      position: relative;
      left: -5px;
    }
  }
}

.menus {
  li {
    line-height: 40px;
    // padding-left: 35px;
    text-align: center;

    &:hover, &.on {
      a {
        color: #D51423;
      }
    }
  }

  a {
    color: #333;
    font-size: 14px;
  }
}
</style>
