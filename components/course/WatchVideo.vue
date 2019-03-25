<template>
  <div class="detail_video">
    <div class="video_header clearfix">
      <ul class="header_left clearfix" v-if="userInfo">
        <router-link :to="{name: 'index'}"><li class="return_btn"><img class="return_img" src="~/assets/image/return.svg" alt=""></li></router-link>
        <li class="vider_title">
          {{courseInfo.courseName}}
          <!-- <a :class="{collect_btn: true, noposi: true}" href="javascript:" @click="setCollection"><span class="iconfont">&#xe670;</span>&nbsp;收藏</a> -->
        </li>
      </ul>
      <ul class="header_right clearfix">
        <li v-if="userInfo.roleType === 2"><nuxt-link :to="{name: 'account-teacher-course'}" class="left_col">讲师中心</nuxt-link></li>
        <li><nuxt-link :to="{name: 'account-order'}" class="left_col">我的订单</nuxt-link></li>
        <li>
          <nuxt-link :to="{name: 'account'}" :class="{left_col: true, c_gold: isVip}">{{userInfo.mobile}}</nuxt-link>
          <img v-if="isVip" src="~/assets/image/vip_icon.png" @click="goVip" alt="" class="vip_icon">
        </li>
       <!--  <li v-else>
          <a href="javascript:" @click="login" class="left_col">登录</a>
          <nuxt-link to="login?tab=2" class="pd_0">注册</nuxt-link>
        </li> -->
        <!-- <li><a href="#">退出</a></li> -->
      </ul>
    </div>
    <div class="video_body">
      <div class="video_content clearfix" :class="{show_panel: cateType}">
        <div class="win_box">
          <div class="video_win" id="player" ref="videobox" :style="'background-image:url('+courseInfo.courseLogo+')'">
          </div>
          <span class="iconfont close_video" v-if="showTop" @click="stopVideo">&#xe616;</span>
        </div>
        <div class="video_info">
          <a href="javascript:" @click="changeTab(1)" :class="{on: cateType == 1}">
            <i class="iconfont">&#xe908;</i>
            <p>章节</p>
          </a>
          <a href="javascript:" @click="changeTab(2)" :class="{on: cateType == 2}">
            <i class="iconfont">&#xe602;</i>
            <p>课件</p>
          </a>
        </div>
        <div class="cate_panel">
          <div  v-if="cateType == 1">
            <dl v-for="(one, index) in courseInfo.chapterList" :key="index">
              <dt>第{{index + 1}}章：{{one.chapterName}}</dt>
              <dd v-for="(two, num) in one.periodList" :key="num" :class="{on : nowNo == two.id}" @click="videoPlay(two)"><i class="iconfont">&#xe690;</i><span>第{{num + 1}}讲：</span>{{two.periodName}}
                <span class="no_video2" v-if="!two.videoVid">(未更新)</span>
                <span class="c_blue" v-if="two.isFree">(免费)</span>
              </dd>
            </dl>
          </div>
          <div v-if="cateType == 2">
            <dl v-for="(one, index) in courseInfo.chapterList" :key="index">
              <dt>{{one.chapterName}}</dt>
              <dd v-for="(two, num) in one.periodList" :key="num" v-if="two.isDoc">
                <a href="javascript:" @click="noDown"><i class="iconfont">&#xe602;</i>{{two.docName}}</a>
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
    nowNo: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isVip: false,
      showTop: false,
      cateType: 0,
      clientData: this.$store.state.clientData,
      userInfo: ''
    }
  },
  methods: {

    changeTab (int) {
      if (int === this.cateType) {
        this.cateType = 0;
      } else {
        this.cateType = int;
      }
    },
    goVip () {
      this.$router.push({name: 'vip'})
    },
    // 下载附件
    noDown (item) {
      if (!this.$store.state.tokenInfo) {
        this.$msgBox({
          content: '登录后才可以下载'
        }).then(res => {
          this.$store.dispatch('REDIRECT_LOGIN');
        }).catch(() => {
        })
        return false;
      }
      if (!item.isFree) {
        this.$msgBox({
          content: '购买后才可以下载',
          isShowCancelBtn: false
        }).then(() => {
          // this.openOrder()
        }).catch(() => {})
        return false;
      }
      window.location.href = item.docUrl
    },
    videoPlay (data) {
      console.log(data)
      if (!data.videoVid) {
        this.$msgBox({
          content: '该视频未更新',
          isShowCancelBtn: false
        }).catch(() => {})
        return false;
      }
      this.$emit('playfunc', data)
    }
  },
  mounted () {
    this.userInfo = this.$store.state.userInfo;
    console.log(this.$store.state.userInfo)
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
          background: rgb(245, 245, 245);
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
        &:hover,&.on {
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
  .cate_panel{
    position: absolute;
    z-index: 11;
    top: 0;
    right: -202px;
    background-color: #000;
    height: 595px;
    width: 210px;
    padding: 20px 30px;
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
    dt{
      color: #fff;
      font-size: 14px;
      line-height: 18px;
    }
    dd{
      color: #999;
      line-height: 26px;
      padding-left: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      i{
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
  .show_panel{
    .cate_panel{
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
