<template>
  <div class="right_window">
    <div class="iconfont right_item show_xcx" @click.stop="hideEwm = false" @mouseenter="hideEwm = false" v-if="webInfo && webInfo.weixinXcx">
      &#xe619;
      <!-- <div class="wx_xcx">
        <div class="xcx_title">微信小程序</div>
        <img class="show_img" :src="webInfo.weixinXcx" alt="">
      </div> -->
      <div class="xcx_box" v-if="webInfo && webInfo.weixinXcx && !hideEwm">
        <div class="ewm_box">
          <img class="ewm_img" :src="webInfo.weixinXcx" alt="">
          <p>关注小程序</p>
          <p>学习更便捷</p>
        </div>
      </div>
    </div>
    <!-- <div class="iconfont right_item show_gzh" v-if="webInfo.weixin">
      &#xe63e;
      <div class="wx_gzh">
        <div class="xcx_title">官方微信</div>
        <img class="show_img" :src="webInfo.weixin" alt="">
      </div>
    </div> -->
    <div class="iconfont right_item show_kefu" v-if="webInfo && webInfo.isShowService" @mouseenter="showKefu" @mouseleave="hideKefu">
      &#xe635;
      <div :class="{kefu: true}" v-if="isKefu">
        <a :href="'http://wpa.qq.com/msgrd?y=3&uin=' + webInfo.service1 + '&site=qq&menu=yes'" v-if="webInfo.service1" target="_blank">
          客服：{{webInfo.service1}}
          <img src="http://wpa.qq.com/pa?p=2:297115770:52" class="qq_img" alt="">
        </a>
        <a :href="'http://wpa.qq.com/msgrd?y=3&uin=' + webInfo.service2 + '&site=qq&menu=yes'" v-if="webInfo.service2" target="_blank">
          客服：{{webInfo.service2}}
          <img src="http://wpa.qq.com/pa?p=2:297115770:52" class="qq_img" alt="">
        </a>
        <a :href="'http://wpa.qq.com/msgrd?y=3&uin=' + webInfo.service3 + '&site=qq&menu=yes'" v-if="webInfo.service3" target="_blank">
          客服：{{webInfo.service3}}
          <img src="http://wpa.qq.com/pa?p=2:297115770:52" class="qq_img" alt="">
        </a>
        <a :href="'http://wpa.qq.com/msgrd?y=3&uin=' + webInfo.service4 + '&site=qq&menu=yes'" v-if="webInfo.service4" target="_blank">
          客服：{{webInfo.service4}}
          <img src="http://wpa.qq.com/pa?p=2:297115770:52" class="qq_img" alt="">
        </a>
        <a :href="'http://wpa.qq.com/msgrd?y=3&uin=' + webInfo.service5 + '&site=qq&menu=yes'" v-if="webInfo.service5" target="_blank">
          客服：{{webInfo.service5}}
          <img src="http://wpa.qq.com/pa?p=2:297115770:52" class="qq_img" alt="">
        </a>
      </div>
    </div>
    <div class="iconfont right_item" @click="goTop">&#xe639;</div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  watch: {
    changeEwm () {
      this.hideEwm = true
    }
  },
  data () {
    return {
      webInfo: '',
      isKefu: false,
      hideEwm: false
    }
  },
  computed: {
    changeEwm () {
      return this.$store.state.changeEwm
    }
  },
  methods: {
    // 显示客服列表
    showKefu () {
      this.isKefu = true
      this.hideEwm = true
    },
    // 隐藏客服列表
    hideKefu () {
      this.isKefu = false
    },
    // 返回顶部
    goTop () {
      window.scrollTo(0, 0);
    }
  },
  mounted () {
    this.webInfo = this.$store.state.webInfo
    if (this.$route.path != '/' && this.$route.path != '/index') {
      this.hideEwm = true
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  .right_window {
    width: 50px;
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 999;
    // transform: translateY(-50%);
    // bottom: 20px;
    .right_item {
      margin: 1px 0;
      width: 50px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background: #ddd;
      color: #fff;
      font-size: 26px;
      &:hover {
        cursor: pointer;
        background: #107bc5;
      }
    }
    .xcx_box {
      position: absolute;
      z-index: 20;
      left: -150px;
      // top: 10px;
      bottom: 100px;
      border-radius: 6px;
      width: 140px;
      height: 190px;
      background: rgba(57, 143, 242, 1);
      padding: 4px;
      .ewm_box {
        width: 130px;
        height: 180px;
        padding: 6px;
        background: rgba(16, 123, 197, 1);
        position: relative;
      }
      .ewm_img {
        width: 120px;
        height: 120px;
      }
      p {
        font-size: 14px;
        color: #fff;
        text-align: center;
        height: 20px;
        line-height: 20px;
        transform: translateY(-6px);
      }
    }
    .wx_xcx, .wx_gzh, .kefu {
      position: absolute;
      padding: 0 10px;
      width: 140px;
      left: -170px;
      // top: 10px;
      bottom: 50px;
      display: none;
      background: #fff;
      .show_img {
        width: 140px;
        height: 140px;
      }
    }
    .kefu {
      color: #333;
      display: block;
      font-size: 14px;
      width: 190px;
      left: -180px;
      background: none;
      margin-right: 10px;
      border-radius: 6px;
      a {
        background: #fff;
        display: block;
        margin-right: 10px;
        font-size: 12px;
        &:hover {
          color: #107ec4;
          text-decoration: none;
        }
      }
      &.top50 {
        top: 50px;
      }
      &.top100 {
        top: 100px;
      }
    }
  }
  .show_xcx {
    &:hover .wx_xcx {
      display: block;
    }
  }
  .show_gzh {
    &:hover .wx_gzh {
      display: block;
    }
  }
  .qq_img {
    position: relative;
    top: 5px;
  }
  .xcx_title {
    text-align: center;
    font-size: 12px;
    color: #333;
    height: 30px;
    padding-bottom: 15px;
  }
</style>
