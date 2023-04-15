<!-- 课程信息展示 -->
<template>
  <div class="">
    <y-header :active="'kczx'" />
    <div class="detail_content">
      <div class="detail_body">
        <ul class="detail_header clearfix">
          <li>
            <nuxt-link :to="{name: 'index'}">首页</nuxt-link>
            <span>></span>
          </li>
          <li>
            <nuxt-link :to="{name: 'list'}">课程中心</nuxt-link>
            <span>></span>
          </li>
          <li>{{ courseInfo.courseName }}</li>
        </ul>
        <div class="clearfix">
          <div class="video_box">
            <div id="player" ref="videobox" class="detail_view" :style="'background-image:url('+courseInfo.courseLogo+')'" />
          </div>
          <div class="view_info">
            <p>{{ courseInfo.courseName }}</p>
            <div class="view_price">
              <div>
                价格:<span v-if="courseInfo.coursePrice === 0">免费</span> <span v-else>￥{{ courseInfo.coursePrice }} <b style="text-decoration-line: line-through;font-size: 18px">￥{{ courseInfo.rulingPrice }}</b></span>
              </div>
            </div>
            <div v-if="teacherInfo" class="view_teacher">
              <span class="text_b">讲师:</span>{{ teacherInfo.lecturerName }}
            </div>
            <div class="view_teacher mgt20">
              <span class="text_b">购买:</span>{{ courseInfo.countBuy }} 人
            </div>
            <div class="foot_box">
              <button v-if="courseInfo.isFree && !isLogin" class="buy_btn" @click="goLogin">登录观看</button>
              <button v-else id="buyBtn" class="buy_btn" @click="buyCourse">立即购买</button>
              <div class="handle_info_btn">
                <div class="study_num">
                  <span class="iconfont mgr10">&#xe60a;</span>{{ courseInfo.countStudy }} 人已学习
                </div>
                <div class="handle_info_btn collect_btn" @click="handleCollect">
                  <img v-if="isCollect" src="@/assets/image/icon_collect_active.svg" alt="">
                  <img v-else src="@/assets/image/icon_collect.svg" alt="">
                  收藏
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <d-pay v-if="showPay" :is-course="true" :data="payData" @hidefun="showPay = false" />
  </div>
</template>
<script>
import YHeader from '../common/Header'
import DPay from '@/components/common/Pay'
import { courseCollectAdd } from '@/api/course.js'

export default {
  components: {
    DPay,
    YHeader
  },
  props: {
    courseInfo: {
      type: Object,
      default: null
    },
    teacherInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      payData: null,
      showPay: false,
      isCollect: false,
      activityText: '',
      isLogin: !!this.$store.state.tokenInfo
    }
  },
  mounted() {
    this.isCollect = this.courseInfo.courseCollect
  },
  methods: {
    handleCollect() {
      if (!this.isLogin) {
        this.$msgBox({
          content: '请先登录',
          isShowCancelBtn: false
        }).then(() => {
          this.$store.dispatch('REDIRECT_LOGIN')
        })
        return
      }
      courseCollectAdd({
        courseId: this.courseInfo.id
      }).then(res => {
        if (res === 'add') {
          this.$msgBox({
            content: '收藏成功',
            isShowCancelBtn: false
          }).then(() => {})
          this.isCollect = true
        } else {
          this.$msgBox({
            content: '取消收藏',
            isShowCancelBtn: false
          }).then(() => {})
          this.isCollect = false
        }
      })
    },
    goLogin() {
      this.$store.dispatch('REDIRECT_LOGIN')
    },
    stopVideo() {
    },
    // 购买视频
    buyCourse(event) {
      if (!this.isLogin) {
        this.$msgBox({
          content: '请登录后再购买',
          isShowCancelBtn: false
        }).then(() => {
          this.$store.dispatch('REDIRECT_LOGIN')
        })
        return
      }

      this.showPay = true
      this.payData = { course: this.courseInfo, payType: 'course' }
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
  width: 620px;
  height: 300px;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  .handle_info_btn {
    display: flex;
    align-items: center;
    color: #999;
    font-size: 14px;
  }
  .study_num {
    height: 36px;
    line-height: 36px;
    color: #999;
    font-size: 14px;
    margin-right: 20px;
  }
  .collect_btn {
    cursor: pointer;
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
  float: left;
  width: 540px;
  height: 300px;
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
