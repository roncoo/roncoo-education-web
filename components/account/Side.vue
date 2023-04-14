<template>
  <header class="side_box">
    <div class="menu_panel">
      <h3 class="title"><i class="iconfont">&#xe60a;</i>个人资料</h3>
      <ul class="menus">
        <li :class="{on: type == 'wdkc'}">
          <router-link :to="{name: 'account-course'}">我的课程</router-link>
        </li>
        <li :class="{on: type == 'wdsc'}">
          <router-link :to="{name: 'account-collect'}">我的收藏</router-link>
        </li>
        <li :class="{on: type == 'wddd'}">
          <router-link :to="{name: 'account-order'}">我的订单</router-link>
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

export default {
  props: {
    type: {
      type: String,
      default: 'wdkc'
    }
  },
  data() {
    return {
      websiteInfo: this.$store.state.websiteInfo,
      tokenInfo: this.$store.state.tokenInfo,
      userInfo: this.$store.state.userInfo
    }
  },
  mounted() {
    bq()
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
