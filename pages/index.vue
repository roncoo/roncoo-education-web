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
          <nuxt-link v-if="item.zoneCourseCategory == 1" :to="{name: 'list'}" class="fr small_text link_text">更多课程 ></nuxt-link>
          <nuxt-link v-else-if="item.zoneCourseCategory == 0" :to="{name: 'library'}" class="fr small_text link_text">更多题 ></nuxt-link>
          <nuxt-link v-else-if="item.zoneCourseCategory == 2" :to="{name: 'live'}" class="fr small_text link_text">更多直播 ></nuxt-link>
          <nuxt-link v-else-if="item.zoneCourseCategory == 3" :to="{name: 'live'}" class="fr small_text link_text">更多直播 ></nuxt-link>
          <nuxt-link v-else-if="item.zoneCourseCategory == 4" :to="{name: 'resource'}" class="fr small_text link_text">更多资源 ></nuxt-link>
          <nuxt-link v-else :to="{name: 'courselist'}" class="fr small_text link_text">更多课程 ></nuxt-link>
        </div>
        </div>
        <div class="zone_body">
          <ul class="clearfix course_list">
            <li v-for="(that, int) in item.zoneCourseList" :key="int">
              <nuxt-link target="_blank" :to="{name: 'view-id', params: {id: that.id}}">
                <div class="img_box">
                  <div class="qizi" v-if="activityObj && activityObj['a' + that.courseNo]">
                    <span v-if="activityObj['a' + that.courseNo].discountType == 1">折扣<br>{{activityObj['a' + that.courseNo].discountPrice * 10}}折</span>
                    <span v-if="activityObj['a' + that.courseNo].discountType == 2">立减<br>{{activityObj['a' + that.courseNo].discountPrice}}</span>
                  </div>
                  <img :src="that.courseImg" alt="">
                </div>
              <p>{{ that.courseName }}</p>
              <span v-if="that.isFree" class="price_box">免费</span>
              <span class="price_box" v-else>￥{{that.orgPrice.toFixed(2)}}<span class="font_12 padl_10" v-if="openVip && that.fabPrice != that.orgPrice">SVIP:{{that.fabPrice ? '￥' + that.fabPrice.toFixed(2) : '免费'}}</span></span>
              </nuxt-link>
            </li>
            <li v-for="thatLive in item.liveCourseList" :key="thatLive.id">
              <nuxt-link target="_blank" :to="{name: 'live-id', params: {id: thatLive.id}}">
                <div class="img_box">
                  <div class="qizi" v-if="activityObj && activityObj['a' + thatLive.courseNo]">
                    <span v-if="activityObj['a' + thatLive.courseNo].discountType == 1">折扣<br>{{activityObj['a' + thatLive.courseNo].discountPrice * 10}}折</span>
                    <span v-if="activityObj['a' + thatLive.courseNo].discountType == 2">立减<br>{{activityObj['a' + thatLive.courseNo].discountPrice}}</span>
                  </div>
                  <img :src="thatLive.courseImg" alt="">
                  <div class="live_time">
                    <p style="font-size: 12px;" v-if="thatLive.liveTime">开播时间：{{thatLive.liveTime}}</p>
                    <p style="font-size: 12px;" v-if="thatLive.endTime">有效期至：{{thatLive.endTime}}</p>
                  </div>
                </div>
              <p>{{ thatLive.courseName }}（直播）</p>
              <span class="price_box" v-if="thatLive.isFree">免费</span>
              <span class="price_box" v-else>￥{{thatLive.orgPrice.toFixed(2)}}<span class="font_12 padl_10" v-if="openVip && thatLive.fabPrice != thatLive.orgPrice">SVIP:{{thatLive.fabPrice ? '￥' + thatLive.fabPrice.toFixed(2) : '免费'}}</span></span>
              </nuxt-link>
            </li>
            <li v-for="thatGroup in item.zoneCourseCombinaRefList" :key="thatGroup.id">
              <nuxt-link target="_blank" :to="{name: 'liveAndBunch', params: {id: thatGroup.id}}">
                <div class="img_box">
                  <div class="qizi" v-if="activityObj && activityObj['a' + thatGroup.courseNo]">
                    <span v-if="activityObj['a' + thatGroup.courseNo].discountType == 1">折扣<br>{{activityObj['a' + thatGroup.courseNo].discountPrice * 10}}折</span>
                    <span v-if="activityObj['a' + thatGroup.courseNo].discountType == 2">立减<br>{{activityObj['a' + thatGroup.courseNo].discountPrice}}</span>
                  </div>
                  <img :src="thatGroup.courseImg" alt="">
                </div>
              <p>{{ thatGroup.courseName }} (录播+直播)</p>
              <span class="price_box" v-if="thatGroup.isFree">免费</span>
              <span class="price_box" v-else>￥{{thatGroup.orgPrice.toFixed(2)}}<span class="font_12 padl_10" v-if="openVip && thatGroup.fabPrice != thatGroup.orgPrice">SVIP:{{thatGroup.fabPrice ? '￥' + thatGroup.fabPrice.toFixed(2) : '免费'}}</span></span>
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
import {zoneCourse, advList} from '~/api/main.js'
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
    console.log(clientNo)
    return {
      classList: [],
      zoneData: null
    }
  },
  methods: {
  },
  mounted () {
    console.log(this.$store.state.webInfo)
    console.log("this.webInfo")
    if (this.webInfo && this.webInfo.isEnableVip) {
      this.openVip = true
    }
    // console.log(this.clientData.no)
    // this.getAdv();
    // this.getZone();
    // this.checkToken();
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
