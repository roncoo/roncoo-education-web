<template>
  <div class="index_page">
    <y-header :active="'index'" />
    <y-banner :data="advData" :height="366" :class-list="classList" />
    <div v-for="(item, index) in zoneData" :key="index" class="i_content">
      <div class="i_zone">
        <div class="zone_header">
          <div class="big_text">
            <span class="col_block" />
            {{ item.name }}
            <span class="small_text">{{ item.zoneDesc }}</span>
            <nuxt-link :to="{ name: 'list' }" class="fr small_text link_text">更多课程 ></nuxt-link>
          </div>
        </div>
        <div class="zone_body">
          <ul class="clearfix course_list">
            <li v-for="(that, int) in item.zoneListList" :key="int">
              <nuxt-link target="_blank" :to="{ name: 'view-id', params: { id: that.id } }">
                <div class="img_box">
                  <img :src="that.courseLogo" alt="">
                </div>
                <p>{{ that.courseName }}</p>
                <span v-if="that.isFree" class="price_box">免费</span>
                <span v-else class="price_box">￥{{ that.courseOriginal.toFixed(2) }}
                  <span v-if="openVip && that.courseDiscount != that.courseOriginal" class="font_12 padl_10">SVIP:{{ that.courseDiscount ? "￥" + that.courseDiscount.toFixed(2) : "免费" }}</span></span>
              </nuxt-link>
            </li>
            <li v-for="thatLive in item.liveCourseList" :key="thatLive.id">
              <nuxt-link target="_blank" :to="{ name: 'live-id', params: { id: thatLive.id } }">
                <div class="img_box">
                  <img :src="thatLive.courseLogo" alt="">
                  <div class="live_time">
                    <p v-if="thatLive.liveTime" style="font-size: 12px"> 开播时间：{{ thatLive.liveTime }} </p>
                    <p v-if="thatLive.endTime" style="font-size: 12px"> 有效期至：{{ thatLive.endTime }} </p>
                  </div>
                </div>
                <p>{{ thatLive.courseName }}（直播）</p>
                <span v-if="thatLive.isFree" class="price_box">免费</span>
                <span v-else class="price_box">￥{{ thatLive.courseOriginal.toFixed(2) }}
                  <span v-if="openVip && thatLive.courseDiscount != thatLive.courseOriginal" class="font_12 padl_10">
                    SVIP:{{ thatLive.courseDiscount ? "￥" + thatLive.courseDiscount.toFixed(2) : "免费" }}
                  </span>
                </span>
              </nuxt-link>
            </li>
            <li v-for="thatGroup in item.zoneListCombinaRefList" :key="thatGroup.id">
              <nuxt-link target="_blank" :to="{ name: 'liveAndBunch', params: { id: thatGroup.id } }">
                <div class="img_box">
                  <img :src="thatGroup.courseLogo" alt="">
                </div>
                <p>{{ thatGroup.courseName }} (录播+直播)</p>
                <span v-if="thatGroup.isFree" class="price_box">免费</span>
                <span v-else class="price_box">￥{{ thatGroup.courseOriginal.toFixed(2) }}<span v-if=" openVip && thatGroup.courseDiscount != thatGroup.courseOriginal" class="font_12 padl_10">SVIP:{{ thatGroup.courseDiscount ? "￥" + thatGroup.courseDiscount.toFixed(2) : "免费" }}</span></span>
              </nuxt-link>
            </li>
          </ul>
          <ul class="test_list clearfix">
            <li v-for="(resource, num) in item.zoneListLibList" :key="resource.id" :class="{ test_option: true, right_0: num % 2 == 1 }">
              <nuxt-link target="_blank" :to="{ name: 'libraryDetail', params: { id: resource.id } }"><i class="iconfont">&#xe6be;</i>{{ resource.courseName }}</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <y-footer />
    <right-tap />
    <div v-if="isvideoAlert" class="videoAlert">
      <div class="videoAlertbox">
        <a href="https://edu.roncoo.net/video" target="_blank">
          <img src="../assets/image/videoAlert.png" class="videoAlertImg" alt="视频点播平台"> </a>
        <img src="../assets/image/videoAlertClone.png" class="videoAlertClone" alt="视频点播平台" @click="cloneVideoAlert()">
      </div>
    </div>
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YBanner from '~/components/Banner'
import YFooter from '~/components/common/Footer'
import RightTap from '~/components/common/RightTap'
import { carouselList, categoryList, zoneList } from '~/api/main.js'

export default {
  components: {
    YHeader,
    YBanner,
    YFooter,
    RightTap
  },
  async asyncData(context) {
    try {
      const dataObj = {}
      // 轮播图
      dataObj.advData = await carouselList()
      // 分类
      dataObj.classList = await categoryList()
      // 分区
      dataObj.zoneData = await zoneList({})
      return dataObj
    } catch (e) {
      context.error({ message: 'User not found', statusCode: 404 })
    }
  },
  data() {
    return {
      isvideoAlert: false,
      websiteInfo: this.$store.state.websiteInfo,
      clientNo: this.$store.state.clientData.no,
      openVip: false,
      advData: this.$store.state.advData
    }
  },
  head() {
    return {
      title: this.$store.state.clientData.name,
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.$store.state.websiteInfo.websiteKeyword
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$store.state.websiteInfo.websiteDesc
        }
      ]
    }
  },
  mounted() {
    if (this.websiteInfo && this.websiteInfo.isEnableVip) {
      this.openVip = true
    }
    // this.$store.dispatch('REDIRECT_LOGIN', 301)
  },
  methods: {
    cloneVideoAlert() {
      this.isvideoAlert = false
    }
  }
}
</script>
<style lang="scss" scoped>
.videoAlert {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  //background: rgba(0,0,0,.4);

  .videoAlertbox {
    position: absolute;
    width: 420px;
    top: 50%;
    left: 50%;
    height: 472px;
    margin: -246px 0 0 -210px;

    .videoAlertImg {
      height: 472px;
      width: 420px;
    }

    .videoAlertClone {
      position: absolute;
      bottom: -40px;
      left: 50%;
      margin-left: -16px;
      width: 32px;
      font-size: 30px;
      height: 32px;
      border-radius: 20px;
    }
  }
}
</style>
<style lang="scss" rel="stylesheet/scss">
.index_page {
  .clearfix:before,
  .clearfix:after {
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
        transition: all 0.3s;
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

  .test_list {
    .test_option {
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

    .iconfont {
      margin-right: 6px;
    }
  }
}
</style>
