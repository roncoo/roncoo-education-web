<template>
  <div class="index_page">
    <y-header :active="'index'" />
    <y-banner :data="carouselData" :height="366" :category-list="categoryData" />
    <div v-for="(item, index) in zoneData" :key="index" class="i_content">
      <div class="i_zone">
        <div class="zone_header">
          <div class="big_text">
            <span class="col_block" />
            {{ item.zoneName }}
            <span class="small_text">{{ item.zoneDesc }}</span>
            <nuxt-link :to="{ name: 'list' }" class="fr small_text link_text">更多课程 ></nuxt-link>
          </div>
        </div>
        <div class="zone_body">
          <ul class="clearfix course_list">
            <li v-for="(that, int) in item.courseList" :key="int">
              <nuxt-link target="_blank" :to="{ name: 'course-id', params: { id: that.id } }">
                <div class="img_box">
                  <img :src="that.courseLogo" alt="">
                </div>
                <p>{{ that.courseName }}</p>
                <span v-if="that.coursePrice === 0" class="price_box">免费</span>
                <span v-else class="price_box">￥{{ that.coursePrice }} <span style="text-decoration-line: line-through;font-size: 12px">￥{{ that.rulingPrice }}</span></span>
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <y-footer />
    <right-tap />
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YBanner from '~/components/common/Banner'
import YFooter from '~/components/common/Footer'
import RightTap from '@/components/common/Top'
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
      dataObj.carouselData = await carouselList()
      // 分类
      dataObj.categoryData = await categoryList()
      // 分区
      dataObj.zoneData = await zoneList({})
      return dataObj
    } catch (e) {
      context.error({ message: 'data no found', statusCode: 404 })
    }
  },
  data() {
    return {
      websiteInfo: this.$store.state.websiteInfo
    }
  },
  head() {
    return {
      title: this.$store.state.websiteInfo.websiteName,
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
  },
  methods: {}
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
    background: #f6f8fb;

    .i_zone {
      width: 1200px;
      margin: 0 auto;
      padding: 20px 0;
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
      height: 222px;
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
          height: 158px;
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
            height: 158px;
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
