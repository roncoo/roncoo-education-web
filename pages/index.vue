<template>
  <div class="index_page">
    <y-header :active="'index'"></y-header>
    <y-banner :data="advData" :height="366" :classList="classList"></y-banner>
    <div class="i_content" v-for="(item, index) in zoneData" :key="index">
      <div class="i_zone">
        <div class="zone_header">
        <div class="big_text">
          <span class="col_block"></span>
          {{ item.name }}
          <span class="small_text">{{ item.zoneDesc }}</span>
          <nuxt-link :to="{name: 'list'}" class="fr small_text link_text">更多课程 ></nuxt-link>
        </div>
        </div>
        <div class="zone_body">
          <ul class="clearfix course_list">
            <li v-for="(that, int) in item.zoneCourseList" :key="int">
              <nuxt-link target="_blank" :to="{name: 'view-id', params: {id: that.id}}">
                <div class="img_box">
                  <img :src="that.courseLogo" alt="">
                </div>
              <p>{{ that.courseName }}</p>
              <span v-if="that.isFree" class="price_box">免费</span>
              <span class="price_box" v-else>￥{{that.courseOriginal.toFixed(2)}}<span class="font_12 padl_10" v-if="openVip && that.courseDiscount != that.courseOriginal">SVIP:{{that.courseDiscount ? '￥' + that.courseDiscount.toFixed(2) : '免费'}}</span></span>
              </nuxt-link>
            </li>
            <li v-for="thatLive in item.liveCourseList" :key="thatLive.id">
              <nuxt-link target="_blank" :to="{name: 'live-id', params: {id: thatLive.id}}">
                <div class="img_box">
                  <img :src="thatLive.courseLogo" alt="">
                  <div class="live_time">
                    <p style="font-size: 12px;" v-if="thatLive.liveTime">开播时间：{{thatLive.liveTime}}</p>
                    <p style="font-size: 12px;" v-if="thatLive.endTime">有效期至：{{thatLive.endTime}}</p>
                  </div>
                </div>
              <p>{{ thatLive.courseName }}（直播）</p>
              <span class="price_box" v-if="thatLive.isFree">免费</span>
              <span class="price_box" v-else>￥{{thatLive.courseOriginal.toFixed(2)}}<span class="font_12 padl_10" v-if="openVip && thatLive.courseDiscount != thatLive.courseOriginal">SVIP:{{thatLive.courseDiscount ? '￥' + thatLive.courseDiscount.toFixed(2) : '免费'}}</span></span>
              </nuxt-link>
            </li>
            <li v-for="thatGroup in item.zoneCourseCombinaRefList" :key="thatGroup.id">
              <nuxt-link target="_blank" :to="{name: 'liveAndBunch', params: {id: thatGroup.id}}">
                <div class="img_box">
                  <img :src="thatGroup.courseLogo" alt="">
                </div>
              <p>{{ thatGroup.courseName }} (录播+直播)</p>
              <span class="price_box" v-if="thatGroup.isFree">免费</span>
              <span class="price_box" v-else>￥{{thatGroup.courseOriginal.toFixed(2)}}<span class="font_12 padl_10" v-if="openVip && thatGroup.courseDiscount != thatGroup.courseOriginal">SVIP:{{thatGroup.courseDiscount ? '￥' + thatGroup.courseDiscount.toFixed(2) : '免费'}}</span></span>
              </nuxt-link>
            </li>
          </ul>
          <ul class="test_list clearfix">
            <li :class="{test_option: true, right_0: (num % 2 == 1)}" v-for="(resource, num) in item.zoneCourseLibList" :key="resource.id">
              <nuxt-link target="_blank" :to="{name: 'libraryDetail', params: {id: resource.id}}"><i class="iconfont">&#xe6be;</i>{{resource.courseName}}</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  <y-footer></y-footer>
  <right-tap></right-tap>
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YBanner from '~/components/Banner'
import YFooter from '~/components/common/Footer'
import RightTap from '~/components/common/RightTap'
import {zoneCourse, advList, indexClass} from '~/api/main.js'
export default {
  components: {
    YHeader,
    YBanner,
    YFooter,
    RightTap
  },
  head () {
      return {
        title: this.$store.state.clientData.name,
        meta: [
            {
                hid: 'keywords',
                name: 'keywords',
                content: this.$store.state.webInfo.websiteKeyword
            },
            {
                hid: 'description',
                name: 'description',
                content: this.$store.state.webInfo.websiteDesc
            }
        ]
      }
  },
  data () {
    return {
      webInfo: this.$store.state.webInfo,
      clientNo: this.$store.state.clientData.no,
      openVip: false,
      advData: this.$store.state.advData,
    }
  },
  async asyncData(context) {
    let clientNo = context.store.state.clientData.no;
    // console.log(clientNo)
    
    try {
      let dataObj = {}
      // 轮播图
      let { data } = await advList({platShow: 0})
      // 轮播图上的分类
      let blockData = await indexClass()
      // 推荐课程
      let zonedata = await zoneCourse({zoneLocation: 0})
      // 活动标
      let zoneList = zonedata.data.data.list || []
      let courseNoList = []
      zoneList.forEach(item => {
        for (let that in item) {
          if (item[that] && typeof item[that] == 'object' && item[that].length && that != 'zoneCourseLibList' && that != 'zoneResourceInfoList') {
            item[that].forEach(course => {
              // console.log(course)
              courseNoList.push(course.courseNo)
            })
          }
        }
      })
      dataObj.advData = data.data.advList || []  //轮播图
      dataObj.zoneData = zonedata.data.data.list || []  //课程专区
      dataObj.classList = blockData.data.data.courseCategoryList || [] //轮播分类
      return dataObj
    } catch (e) {
      context.error({ message: 'User not found', statusCode: 404 })
    }
  },
  methods: {
  },
  mounted () {
    if (this.webInfo && this.webInfo.isEnableVip) {
      this.openVip = true
    }
    // this.$store.dispatch('REDIRECT_LOGIN', 301)
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.index_page {
  .clearfix:before, .clearfix:after {
    content: "";
    display: table;
  }
  .clearfix:after {
    clear: both;
  }
  .i_content {
    background: rgb(245, 245, 245);
    &:nth-child(2n) {
      background: rgb(228, 228, 228);
    }
    .i_zone {
      width: 1200px;
      margin: 0 auto;
      padding: 50px 0 40px 0;
    }
  }
  .zone_header {
    .col_block {
      display: inline-block;
      width: 4px;
      height: 24px;
      background: #333;
      position: relative;
      top: 4px;
    }
    .big_text {
      // text-align: center;
      font-size: 24px;
    }
    .small_text {
      // text-align: center;
      font-size: 14px;
      color: #999;
      margin-top: 10px;
    }
    .link_text:hover {
      text-decoration: none;
      color: #333;
    }
  }
  .zone_body {
    margin-top: 25px;
  }
  .course_list {
    li {
      float: left;
      width: 285px;
      height: 204px;
      border-radius: 6px;
      margin: 0px 20px 20px 0px;
      &:nth-child(4n) {
        margin-right: 0px;
      }
      &:hover {
        box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
        transition: all .3s;
      }
      a {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        background: #fff;
        border-radius: 6px;
        .img_box {
          width: 285px;
          height: 140px;
          position: relative;
          .qizi {
            background: url(../assets/image/activity/qizi.png) no-repeat center;
            position: absolute;
            top: 0;
            left: 10px;
            width: 46px;
            height: 46px;
            color: #fff;
            font-size: 14px;
            text-align: center;
          }
          img {
            width: 285px;
            height: 140px;
            border-radius: 6px 6px 0 0;
          }
          .live_time {
            position: absolute;
            bottom: 0;
            left: 0;
            font-size: 12px;
            line-height: 16px;
            width: 285px;
            background: rgba(0, 0, 0, 0.2);
            color: #fff;
            padding-bottom: 2px;
          }
        }
        &:hover {
          color: #000;
          text-decoration: none;
        }
        p {
          font-size: 16px;
          margin-top: 5px;
          padding-left: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
        }
        .price_box {
          font-size: 16px;
          position: absolute;
          bottom: 10px;
          left: 10px;
          color: red;
        }
      }
    }
  }
  .test_list{
    .test_option{
      float: left;
      width: 520px;
      padding: 18px 25px;
      margin-right: 55px;
      margin-bottom: 20px;
      border-radius: 8px;
      font-size: 14px;
      background-color: #fff;
      &.right_0 {
        margin-right: 0px;
      }
    }
    .iconfont{
      margin-right: 6px;
    }
  }
}
</style>
