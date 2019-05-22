<!-- 轮播图上的分类 -->
<template>
  <div class="class_block" @mouseleave="hideWidth" v-if="classList.length">
    <ul :class="{left_block: true, show_scroll: classList.length > 10}">
      <li @mouseenter="changeWidth(item)" :class="{active: item.id == categoryno1}" :style="classList.length >= 5 && classList.length <= 10 &&'line-height:' + (height/classList.length) + 'px;'" v-for="(item, index) in classList" :key="index">
        <nuxt-link :to="{name: 'list', query: {categoryno1: item.id}}">{{item.categoryName}}</nuxt-link>
        <span class="arrow"></span>
      </li>
    </ul>
    <div class="big_block clearfix" :style="'width:' + width + 'px;'">
      <div class="list_items fl clearfix">
        <div class="list_item clearfix" v-for="(item, index) in twoList" :key="index">
          <nuxt-link :to="{name: 'list', query: {categoryno1, categoryno2: item.id}}" :class="{class_header: true, has_three: item.threeList.length, fl: true}">{{item.categoryName}}</nuxt-link>
          <div class="fl three_box">
            <nuxt-link :to="{name: 'list', query: {categoryno1, categoryno2: item.id, categoryno3: that.id}}" class="three_link" v-for="(that, num) in item.threeList" :key="num">{{that.categoryName}}</nuxt-link>
          </div>
        </div>
      </div>
      <!-- <div class="foot_courses fl clearfix">
        <div class="courses_top">课程推荐</div>
        <div class="foot_course fl" v-for="(item, index) in courseList" :key="index">
          <div class="img_box inline_box">
            <nuxt-link :to="{name: 'view-id', params: {id: item.courseId}}" target="_blank" v-if="item.courseCategory === 1">
              <img class="course_img" :src="item.courseImg" alt="">
            </nuxt-link>
            <nuxt-link :to="{name: 'liveDetail', params: {id: item.courseId}}" target="_blank" v-if="item.courseCategory === 2">
              <img class="course_img" :src="item.courseImg" alt="">
            </nuxt-link>
            <nuxt-link :to="{name: 'liveAndBunch', params: {id: item.courseId}}" target="_blank" v-if="item.courseCategory === 3">
              <img class="course_img" :src="item.courseImg" alt="">
            </nuxt-link>
          </div>
          <div class="course_info inline_box">
            <nuxt-link :to="{name: 'courselDetail', params: {id: item.courseId}}" target="_blank" v-if="item.courseCategory === 1" class="course_name">{{item.courseName}}</nuxt-link>
            <nuxt-link :to="{name: 'liveDetail', params: {id: item.courseId}}" target="_blank" v-if="item.courseCategory === 2" class="course_name">{{item.courseName}}</nuxt-link>
            <nuxt-link :to="{name: 'liveAndBunch', params: {id: item.courseId}}" target="_blank" v-if="item.courseCategory === 3" class="course_name">{{item.courseName}}</nuxt-link>
            <p class="course_price" v-if="item.isFree">免费</p>
            <div class="course_price" v-else>
              ￥{{item.orgPrice}}
              <p v-if="webInfo && webInfo.isEnableVip && item.fabPrice != item.orgPrice" class="font_12 c_gold mgt3">SVIP:{{item.fabPrice ? '￥' + item.fabPrice : '免费'}}</p>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    height: {
      type: [String, Number]
    },
    classList: {
      type: [Array, Object],
      default () {
        return []
      }
    }
  },
  data () {
    return {
      webInfo: this.$store.state.webInfo,
      width: 0,
      courseList: [],
      twoList: [],
      categoryno1: ''
    }
  },
  methods: {
    changeWidth (item) {
      console.log(item)
      this.width = 300
      this.categoryno1 = item.id
      this.twoList = item.twoList
      this.courseList = item.courseList
    },
    hideWidth () {
      this.width = 0
      this.categoryno1 = ''
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
  }
}
</script>
<style lang="scss" scoped>
  a {
    &:hover {
      color: #D51423;
      text-decoration: none;
    }
  }
  .class_block {
    position: absolute;
    height: 100%;
    top: 0;
    left: 50%;
    z-index: 20;
    margin-left: -600px;
  }
  .left_block {
    width: 180px;
    font-size: 14px;
    height: 100%;
    background: rgba(0, 0, 0, 0.67843137254902);
    &.show_scroll {
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: rgba(245, 245, 245, 0.4);
      }
    }
    .arrow {
      display: inline-block;
      width: 5px;
      height: 5px;
      border-top: 1px solid #ccc;
      border-right: 1px solid #ccc;
      transform: rotate(45deg);
      position: absolute;
      right: 10px;
      top: 50%;
      margin-top: -3px;
    }
    li {
      line-height: 50px;
      padding: 0 10px;
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &.active {
        background: rgba(255, 255, 255, 0.9);
        a {
          color: #D51423;
        }
        .arrow {
          border-color: #D51423;
        }
      }
    }
    a {
      color: #ccc;
      display: block;
      &:hover {
        color: #D51423;
      }
    }
  }
  .big_block {
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    margin-left: 90px;
    background: #fff;
    transition: width 0.1s;
    overflow: hidden;
    box-shadow: 1px 0px 1px rgba(0, 0, 0, 0.1);
  }
  .list_items {
    height: 100%;
    width: 300px;
    padding: 0 30px;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: rgba(210, 210, 210, 0.4);
    }
  }
  .list_item {
    padding-top: 20px;
    position: relative;
    line-height: 20px;
    .class_header {
      padding-right: 20px;
      background: #fff;
      font-size: 14px;
      font-weight: 700;
      &.has_three {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 60px;
      }
    }
    .three_box {
      width: 300px;
    }
    .three_link {
      font-size: 14px;
      color: #999;
      display: inline-block;
      margin-right: 20px;
      &:hover {
        color: #D51423;
      }
    }
  }
  .foot_courses {
    padding: 0px 30px;
    height: 100%;
    width: 300px;
    background: rgba(247, 245, 248, 1);
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.1);
    }
    .courses_top {
      font-size: 14px;
      font-weight: 700;
      padding: 20px 0px;
    }
    .foot_course {
      width: 220px;
      position: relative;
      margin-bottom: 20px;
    }
    .inline_box {
      display: inline-block;
      height: 43px;
    }
    .img_box {
      width: 110px;
      height: 63px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 3px;
      }
    }
    .course_info {
      font-size: 14px;
      margin-left: 8px;
    }
    .course_name {
      position: absolute;
      width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333;
      top: 0;
      &:hover {
        text-decoration: none;
        color: #D51423;
      }
    }
    .course_price {
      position: absolute;
      color: #999;
      bottom: 2px;
    }
  }
</style>
