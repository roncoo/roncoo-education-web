<template>
  <div class="right_window">
    <div class="iconfont right_item show_kefu" @mouseenter="showKefu" @mouseleave="hideKefu">
      &#xe635;
      <div v-if="isKefu" :class="{kefu: true}">
        <a :href="'http://wpa.qq.com/msgrd?y=3&uin=297115770&site=qq&menu=yes'" target="_blank">
          客服：297115770
          <img src="http://wpa.qq.com/pa?p=2:297115770:52" class="qq_img" alt="">
        </a>
      </div>
    </div>
    <div class="iconfont right_item" @click="goTop">&#xe639;</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      websiteInfo: '',
      isKefu: false
    }
  },
  mounted() {
    this.websiteInfo = this.$store.state.websiteInfo
  },
  methods: {
    // 显示客服列表
    showKefu() {
      this.isKefu = true
    },
    // 隐藏客服列表
    hideKefu() {
      this.isKefu = false
    },
    // 返回顶部
    goTop() {
      window.scrollTo(0, 0)
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
