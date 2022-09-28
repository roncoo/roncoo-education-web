<template>
  <div class="detail_video">
    <div class="video_header clearfix">
      <ul v-if="userInfo" class="header_left clearfix">
        <router-link :to="{name: 'index'}">
          <li class="return_btn"><img class="return_img" src="~/assets/image/return.svg" alt=""></li>
        </router-link>
        <li class="vider_title"> {{ courseInfo.courseName }}</li>
      </ul>
      <ul class="header_right clearfix">
        <li>
          <nuxt-link :to="{name: 'account-course'}" class="left_col">我的课程</nuxt-link>
        </li>
        <!--
        <li>
          <nuxt-link :to="{name: 'account'}" class="left_col">{{ userInfo.mobile }}</nuxt-link>
        </li>
        -->
      </ul>
    </div>
    <div class="video_body">
      <div class="video_content clearfix" :class="{show_panel: cateType}">
        <div class="win_box">
          <div id="player" ref="videobox" class="video_win" :style="'background-image:url('+courseInfo.courseLogo+')'" />
          <span v-if="showTop" class="iconfont close_video" @click="stopVideo">&#xe616;</span>
        </div>
        <div class="video_info">
          <a href="javascript:" :class="{on: cateType == 1}" @click="changeTab(1)">
            <i class="iconfont">&#xe908;</i>
            <p>目录</p>
          </a>
          <a href="javascript:" :class="{on: cateType == 2}" @click="changeTab(2)">
            <i class="iconfont">&#xe602;</i>
            <p>课件</p>
          </a>
        </div>
        <div class="cate_panel">
          <div v-if="cateType == 1">
            <dl v-for="(one, index) in courseInfo.chapterRespList" :key="index">
              <dt>第{{ index + 1 }}章：{{ one.chapterName }}</dt>
              <dd v-for="(two, num) in one.periodRespList" :key="num" :class="{on : playPeriod == two.id}" @click="playVideo(two)"><i class="iconfont">&#xe690;</i><span>第{{ num + 1 }}节：</span>{{ two.periodName }}
                <span v-if="two.resourceResp && two.resourceResp.videoStatus === 1" class="no_video2">(未更新)</span>
                <span v-if="two.isFree" class="c_blue">(免费)</span>
              </dd>
            </dl>
          </div>
          <div v-if="cateType == 2">
            <dl v-for="(one, index) in courseInfo.chapterRespList" :key="index">
              <dt>{{ one.chapterName }}</dt>
              <dd v-for="(two, num) in one.periodRespList" :key="num">
                <a href="javascript:" @click="downFile"><i class="iconfont">&#xe602;</i>{{ two.periodName }}</a>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    courseInfo: {
      type: Object,
      default: null
    },
    playPeriod: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      showTop: false,
      cateType: 0,
      tokenInfo: '',
      userInfo: ''
    }
  },
  mounted() {
    this.tokenInfo = this.$store.state.tokenInfo
    this.userInfo = this.$store.state.userInfo
  },
  methods: {
    changeTab(int) {
      if (int === this.cateType) {
        this.cateType = 0
      } else {
        this.cateType = int
      }
    },
    // 下载附件
    downFile(item) {
      // TODO
    },
    playVideo(data) {
      if (!this.tokenInfo) {
        this.$msgBox({
          content: '请先登录'
        }).then(res => {
          this.$store.dispatch('REDIRECT_LOGIN')
        }).catch(() => {
        })
        return false
      }
      if (data.resourceResp && data.resourceResp.videoStatus === 1) {
        this.$msgBox({
          content: '该视频未更新',
          isShowCancelBtn: false
        }).catch(() => {
        })
        return false
      }
      this.$emit('playfunc', data.id)
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.detail_video {
  background: #fff;
}

.video_header {
  height: 66px;
  width: 1200px;
  margin: 0 auto;

  li {
    float: left;
    line-height: 66px;
  }

  .header_left {
    float: left;

    a {
      color: #999;
      margin-left: 10px;

      &:hover {
        text-decoration: none;
        color: #333;
      }
    }

    .left_30 {
      margin-left: 30px;
    }

    .return_btn {
      width: 66px;
      height: 66px;

      &:hover {
        background: #f6f8fb;
      }
    }

    .return_img {
      width: 20px;
      height: 20px;
      margin-left: 23px;
      margin-top: 23px;
    }

    .vider_title {
      font-size: 16px;
      font-weight: 700;
      color: #333;
      margin-left: 20px;

      a:hover {
        color: #d51423;
      }

      .c_red {
        color: #d51423;
      }
    }
  }

  .header_right {
    float: right;

    a {
      padding: 0 10px;
      font-size: 12px;
      color: #333;

      &:hover {
        text-decoration: none;
        color: #D51423;
      }

      &.c_gold {
        color: #CA9E70;
      }

      &.no_left {
        padding-left: 0px;
      }
    }

    .left_col {
      border-left: 1px solid #ccc;
    }

    .pd_0 {
      padding-left: 0px;
    }

    .vip_icon {
      width: 14px;
      height: 13px;
      position: relative;
      left: -10px;
      top: 1px;
      cursor: pointer;
    }
  }
}

.video_body {
  background: rgb(51, 51, 51);

  .video_content {
    width: 1200px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
  }

  .win_box {
    float: left;
    width: 1120px;
    height: 595px;
    margin: 5px 0;
    border-radius: 8px;
    border: 5px solid #000;
  }

  .video_win {
    width: 1110px;
    height: 585px;
    -webkit-background-size: 100%;
    background-size: 100%;

    &.mini_win {
      width: 600px;
      height: 295px;
      position: fixed;
      right: 10px;
      bottom: 30px;
      z-index: 9999;
    }
  }

  .video_info {
    position: relative;
    z-index: 41;
    float: right;
    padding-top: 20px;
    height: 595px;
    background-color: #333;

    a {
      overflow: hidden;
      display: block;
      height: 86px;
      width: 69px;
      color: #ccc;

      &:hover, &.on {
        text-decoration: none;
        background: #000;
      }
    }

    i {
      display: block;
      width: 24px;
      height: 23px;
      margin: 20px 20px 10px 20px;
      font-size: 26px;
    }

    p {
      font-size: 14px;
      text-align: center;
      color: #ccc;
    }
  }
}

.cate_panel {
  position: absolute;
  z-index: 11;
  top: 0;
  right: -350px;
  background-color: #000;
  height: 595px;
  width: 400px;
  padding: 20px;
  overflow: auto;
  transition: all .5s;
  z-index: 40;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.4);
  }

  dl {
    margin-bottom: 10px;
  }

  dt {
    color: #fff;
    font-size: 14px;
    line-height: 18px;
  }

  dd {
    color: #999;
    line-height: 26px;
    padding-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    i {
      font-size: 14px;
      margin-right: 8px;
    }

    a {
      color: #999;
    }

    &:hover, &.on, a:hover {
      color: #D51423;
      cursor: pointer;
      text-decoration: none;
    }
  }

  .load_more {
    text-align: center;
    color: #ccc;
  }
}

.show_panel {
  .cate_panel {
    right: 69px;
  }
}

.no_video {
  color: #999;
}

.no_video2 {
  color: #eee;
}

.info_box {
  pre {
    white-space: inherit;
  }
}
</style>
