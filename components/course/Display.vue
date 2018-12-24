<!-- 课程信息展示 -->
<template>
  <div class="">
    <y-header :active="'kczx'"></y-header>
    <div class="detail_content">
      <div class="detail_body">
        <ul class="detail_header clearfix">
          <li><nuxt-link :to="{name: 'index'}">首页</nuxt-link><span>></span></li>
          <li><nuxt-link :to="{name: 'list'}">录播中心</nuxt-link><span>></span></li>
          <li>{{courseInfo.courseName}}</li>
        </ul>
        <div class="clearfix">
          <div class="video_box">
            <div class="detail_view" id="player" :style="'background-image:url('+courseInfo.courseImg+')'"></div>
            <!-- <span class="iconfont close_video" @click="stopVideo">&#xe616;</span> -->
          </div>
          <div class="view_info">
            <p>{{courseInfo.courseName}}</p>
            <div class="view_price">
              <div>
                价格:<span v-if="!courseInfo.isFree">￥{{courseInfo.orgPrice ? courseInfo.orgPrice.toFixed(2) : '0.00'}}</span>
                <span v-else>免费</span>
              </div>
              <div v-if="!courseInfo.isFree && openVip && courseInfo.fabPrice != courseInfo.orgPrice" class="mgt10">
                SVIP:<span class="font_16">{{courseInfo.fabPrice ? '￥' + courseInfo.fabPrice.toFixed(2) : '免费'}}</span>
                <nuxt-link :to="{name: 'vip'}" class="set_vip">{{isVip ? '续费SVIP >' : '立即开通 >'}}</nuxt-link>
              </div>
              <!-- <div class="mgt10">
                优惠券:<span class="favo">￥100</span>
                <span class="favo favo_right">满1999元用100元</span>
                <a href="javascript:" class="set_vip">立即领取 ></a>
              </div> -->
              <div class="mgt10" v-if="activityText">
                促销:<span class="small_favo">{{activityData.activityText}}</span>
                <span class="big_favo" v-if="activityText == '打折'">优惠活动中，购买立打{{activityData.minus * 10}}折</span>
                <span class="big_favo" v-else-if="activityText == '立减'">优惠活动中，购买立减{{activityData.minus}}元</span>
              </div>
            </div>
            <div class="view_teacher">
              <span class="text_b">讲师:</span>{{teacherInfo.lecturerName}}
            </div>
            <div class="view_teacher mgt20" v-if="courseData.courseValidity">
              <span class="text_b">有效期:</span>从购买之日起365天
            </div>
            <!-- <div class="view_teacher mgt20" v-else>
              <span class="text_b">有效期:</span>永久
            </div> -->
            <div class="view_teacher mgt20" v-if="courseData.isShowBuyCount">
              <span class="text_b">购买人数:</span>{{courseInfo.buyCount}} 人
            </div>
            <div class="foot_box">
              <div class="study_num" v-if="courseData.isShowStudyCount">
                <span class="iconfont mgr10">&#xe60a;</span>{{courseInfo.studyCount}} 人已学习
              </div>
              <a :class="{collect_btn: true, c_red: isCollect}" href="javascript:" @click="setCollection"><span class="iconfont">&#xe670;</span>&nbsp;收藏</a>
              <button class="buy_btn" v-if="courseInfo.isFree && !isLogin" @click="goLogin">登录观看</button>
              <button class="buy_btn" id="buyBtn" v-else-if="courseInfo.isPutaway === 1" @click="buyCourse">立即购买</button>
            </div>
            <!-- <a :class="{collect_btn: true, share: true, c_red: isShare}" href="javascript:"><span class="iconfont">&#xe610;</span>&nbsp;分享</a> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {addCollection, attentionSave} from '~/api/user.js'
import YHeader from '../common/Header'
export default {
  components: {
    YHeader
  },
  props: {
    courseInfo: {
      type: Object,
      default: null
    },
    courseData: {
      type: Object,
      default: null
    },
    teacherInfo: {
      type: Object,
      default: null
    },
  },
  data () {
    return {
      isVip: false,
      openVip: false,
      isCollect: '',
      activityText: '',
      activityData: {},
      isLogin: this.$store.state.tokenInfo ? true : false
    }
  },
  methods: {
    goLogin () {
      this.$store.dispatch('REDIRECT_LOGIN');
    },
    stopVideo () {
      console.log("video")
    },
    // 购买视频
    buyCourse (event) {
      this.$emit('buyClick', event)
    },
    
    // 收藏课程
    setCollection () {
      if (!this.isLogin) {
        this.$msgBox({
          content: '登录后才可以收藏'
        }).then(res => {
          this.$store.dispatch('REDIRECT_LOGIN');
        }).catch(() => {
        })
        return false;
      }
      addCollection({
        collectionType: 1,
        courseCategory: 1,
        refNo: this.courseInfo.id,
        mobile: this.$store.state.userInfo.mobile
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$msgBox({
            content: '收藏成功',
            isShowCancelBtn: false
          })
          this.isCollect = true
        } else {
          this.$msgBox({
            content: res.data.msg,
            isShowCancelBtn: false
          })
          if (res.code === 406) {
            this.isCollect = true
          }
        }
      })
    }
  },
  mounted () {
    this.openVip = this.$store.state.webInfo.isEnableVip;
    if (this.$store.state.userInfo.isVip && this.$store.state.userInfo.expireTime && new Date(this.$store.state.userInfo.expireTime).getTime() > new Date().getTime()) {
        this.isVip = true
      }
  }
}
  
</script>

<style lang="scss" rel="stylesheet/scss">
  .detail_content {
    background: rgb(51, 51, 51);
    .detail_body {
      width: 1200px;
      margin: 0 auto;
      height: 373px;
    }
  }
  .detail_header {
    li {
      float: left;
      line-height: 57px;
      margin: 0 10px;
      color: #fff;
      font-size: 14px;
      span {
        margin-left: 20px;
      }
      a {
        color: #fff;
        &:hover {
          text-decoration: none;
        }
      }
    }
  }
  .view_info {
    float: right;
    width: 570px;
    height: 295px;
    position: relative;
    p {
      font-size: 18px;
      color: #fff;
      word-break: break-all;
    }
    .foot_box {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 36px;
    }
    .buy_btn {
      display: block;
      width: 136px;
      height: 36px;
      color: #fff;
      background: #D51423;
      border: none;
      border-radius: 6px;
      line-height: 36px;
      text-align: center;
      font-size: 14px;
      // position: absolute;
      // bottom: 0px;
      &:hover {
        text-decoration: none;
        color: #fff;
        cursor: pointer;
      }
    }
    .study_num {
      float: right;
      height: 36px;
      line-height: 36px;
      color: #999;
      font-size: 14px;
    }
    .huabei {
      color: #fff;
      font-size: 13px;
      position: absolute;
      bottom: 0;
      padding-left: 25px;
      img {
        width: 17px;
        height: 17px;
        position: absolute;
        left: 0;
      }
    }
  }
  .view_price {
    border-bottom: 1px solid rgb(102, 102, 102);
    padding-bottom: 10px;
    color: rgb(102, 102, 102);
    font-size: 14px;
    margin: 20px 0;
    span {
      font-size: 24px;
      color: #D51423;
      font-weight: bold;
      margin-left: 20px;
    }
    .font_16 {
      font-size: 16px;
      font-weight: 400;
    }
    .set_vip {
      color: #0099FF;
      margin-left: 6px;
    }
    .favo {
      font-size: 10px;
      display: inline-block;
      height: 14px;
      line-height: 14px;
      background: #D51423;
      color: #333;
      padding: 0 8px;
      border-radius: 0 7px 7px 0;
      margin-left: 7px;
    }
    .favo_right {
      background: none;
      border: 1px solid #D51423;
      height: 13px;
      color: #D51423;
      margin-left: -5px;
      border-radius: 7px 0 0 7px;
    }
    .small_favo {
      font-size: 10px;
      border: 1px solid #D51423;
      height: 13px;
      line-height: 14px;
      color: #D51423;
      padding: 0 5px;
    }
    .big_favo {
      color: #999;
      font-size: 14px;
      font-weight: 400;
      margin-left: 3px;
    }
  }
  .detail_view {
    width: 600px;
    height: 295px;
    background: rgb(102, 102, 102);
    background-size: 100%;
    &.float_win {
      position: fixed;
      right: 10px;
      bottom: 30px;
      z-index: 9999;
    }
  }
  .view_teacher {
    color: rgb(102, 102, 102);
    font-size: 14px;
    .text_b {
      margin-right: 20px;
      font-weight: bold;
    }
  }
</style>
