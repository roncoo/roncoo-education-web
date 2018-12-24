<!-- 推荐课程 -->
<template>
  <div class="recommend_box" v-if="recommendList.length">
    <div class="header">推荐课程</div>
    <div class="course_items">
      <div class="course_item" v-for="(item, index) in recommendList" :key="index">
        <div class="img_box inline_box">
          <nuxt-link :to="{name: 'view-id', params: {id: item.courseId}}" target="_blank" v-if="item.courseCategory === 1">
            <img class="course_img" :src="item.courseImg" alt="">
          </nuxt-link>
          <nuxt-link :to="{name: 'live-id', params: {id: item.courseId}}" target="_blank" v-if="item.courseCategory === 2">
            <img class="course_img" :src="item.courseImg" alt="">
          </nuxt-link>
          <nuxt-link :to="{name: 'bunch-id', params: {id: item.courseId}}" target="_blank" v-if="item.courseCategory === 3">
            <img class="course_img" :src="item.courseImg" alt="">
          </nuxt-link>
        </div>
        <div class="course_info inline_box">
          <nuxt-link :to="{name: 'view-id', params: {id: item.courseId}}" target="_blank" v-if="item.courseCategory === 1" class="course_name course_text c_999">{{item.courseName}}</nuxt-link>
          <nuxt-link :to="{name: 'live-id', params: {id: item.courseId}}" target="_blank" v-if="item.courseCategory === 2" class="course_name course_text c_999">{{item.courseName}}</nuxt-link>
          <nuxt-link :to="{name: 'bunch-id', params: {id: item.courseId}}" target="_blank" v-if="item.courseCategory === 3" class="course_name course_text c_999">{{item.courseName}}</nuxt-link>
          <p class="course_price course_text c_red" v-if="item.isFree">免费</p>
          <div class="course_price course_text c_red" v-else>
            ￥{{item.orgPrice}}
            <p v-if="webInfo && webInfo.isEnableVip && item.fabPrice != item.orgPrice" class="c_gold font_12 mgt3">SVIP:{{item.fabPrice ? '￥' + item.fabPrice : '免费'}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { recommendCourse } from '~/api/course.js'
  export default {
    props: {
      categoryNo: {
        type: [String, Number]
      }
    },
    data () {
      return {
        recommendList: []
      }
    },
    watch: {
      categoryNo () {
        console.log(this.categoryNo)
        this.getRecommendCourse()
      }
    },
    methods: {
      getRecommendCourse () {
        recommendCourse({categoryNo: this.categoryNo}).then(res => {
          res = res.data;
          console.log(res)
          console.log("res========")
          if (res.code === 200) {
            if (res.data) {
              this.recommendList = res.data.list
            }
          } else {
            this.$msgBox({
              content: res.msg,
              isShowCancelBtn: false
            }).catch(() => {})
          }
        }).catch(() => {
          console.log('推荐课程')
        })
      },
      // 跳转详情页
      goDetail (id, type) {
        console.log(id)
        let name = ''
        if (type === 1) {
          name = 'courselDetail'
        } else if (type === 2) {
          name = 'liveDetail'
        } else if (type === 3) {
          name = 'liveAndBunch'
        }
        this.$router.push({name, params: {id}})
      }
    },
    mounted () {
      if (this.categoryNo) {
        this.getRecommendCourse()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .recommend_box {
    color: #333;
    background: #fff;
    margin-top: 30px;
    border-radius: 8px;
    font-size: 14px;
    padding-bottom: 20px;
    .header {
      padding-left: 20px;
      line-height: 60px;
      border-bottom: 1px solid #e4e4e4;
    }
    .course_item {
      padding: 20px 20px 0;
    }
    .inline_box {
      position: relative;
      display: inline-block;
    }
    .img_box {
      width: 120px;
      height: 60px;
    }
    .course_img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
    .course_info {
      height: 60px;
    }
    .course_text {
      width: 100px;
      position: absolute;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .course_name {
      top: 0;
      &:hover {
        color: #D51423;
        text-decoration: none;
      }
    }
    .course_price {
      bottom: 0;
    }
  }
</style>
