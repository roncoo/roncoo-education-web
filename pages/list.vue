<template>
  <div class="courselist_page">
    <y-header></y-header>
    <y-header-list :classList="classList" :fourNow="free" :courseType="'course'"></y-header-list>
    <div class="course_content">
      <ul class="clearfix">
        <li v-for="(item, index) in pageObj.list" :key="index">
          <nuxt-link target="_blank" :to="{name: 'view-id', params: {id: item.id}}" class="course_info">
            <div class="img_box">
              <img class="course_img" :src="item.courseLogo" alt="">
            </div>
            <p>{{item.courseName}}</p>
            <span class="price_box" v-if="item.isFree">免费</span>
            <span class="price_box" v-else>￥{{item.courseOriginal.toFixed(2)}}<span class="font_12 padl_10" v-if="openVip && item.courseOriginal !== item.courseDiscount">SVIP:{{item.courseDiscount ? '￥' + item.courseDiscount.toFixed(2) : '免费'}}</span></span>
          </nuxt-link>
        </li>
      </ul>
      <d-page v-if="pageObj.totalPage > 1" :page="pageObj" @btnClick="getPage"></d-page>
    </div>
    <y-footer></y-footer>
    <right-tap></right-tap>
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YFooter from '~/components/common/Footer'
import YHeaderList from '~/components/HeaderList'
import DPage from '~/components/Page'
import RightTap from '~/components/common/RightTap'
import {courseList, courseClass} from '~/api/course.js'
import {courseChange} from '~/utils/commonfun.js'
export default {
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
      openVip: false,
      free: '',
      activityList: [],
      classList: []
    }
  },
  async asyncData (context) {
    let dataObj = {}
    let clientNo = context.store.state.clientData.no
    dataObj.clientNo = clientNo
    dataObj.webInfo = context.store.state.webInfo
    let categoryId1 = context.query.categoryno1 || ''
    let categoryId2 = context.query.categoryno2 || ''
    let categoryId3 = context.query.categoryno3 || ''
    let isFree = ''
    let free = 3
    let isVipFree = ''
    if (context.query.four) {
      let four = context.query.four
      if (parseInt(four) === 3) {
        isFree = ''
        isVipFree = ''
        free = 3
      } else if (parseInt(four) === 2) {
        isFree = 0
        isVipFree = ''
        free = 2
      } else if (parseInt(four) === 1) {
        isFree = 1
        isVipFree = ''
        free = 1
      } else if (parseInt(four) === 4) {
        isVipFree = 1
        isFree = ''
        free = 4
      }
    } else {
      isFree = ''
      free = 3
    }
    let obj = {
          categoryId1,
          categoryId2,
          categoryId3,
          orgNo: clientNo,
          pageCurrent: 1,
          pageSize: 20,
          isFree,
          isVipFree
        }
    let pageObj = {
      list: [],
      pageCurrent: '',
      pageSize: '',
      totalCount: '',
      totalPage: ''
    }
    let classObj = {
      categoryType: 5,
      orgNo: clientNo
    }
    try {
      let allData = await Promise.all([courseList(obj), courseClass(classObj)])
      // 课程列表
      let courseData = allData[0]
      if (courseData.data.data.list.length > 0) {
        pageObj = courseData.data.data
      }
      // 分类
      let classData = await allData[1]
      let classList = classData.data.data.courseCategoryList || []
      dataObj.obj = obj
      dataObj.pageObj = pageObj
      dataObj.classList = classList
      dataObj.free = free
      return dataObj
    } catch (e) {
      context.error({ message: 'User not found', statusCode: 404 })
    }
  },
  watch: {
    '$route' () {
      courseChange(this)
      this.getCourse()
    }
  },
  methods: {
    getCourse () {
      this.$nuxt.$loading.start();
      courseList(this.obj).then(res => {
        this.$nuxt.$loading.finish();
        let result = res.data
        if (result.code === 200) {
          if (result.data.list.length > 0) {
            this.pageObj = result.data;
          } else {
            this.pageObj = {}
          }
        } else {
          this.$msgBox({
            content: result.msg,
            isShowCancelBtn: false
          })
          this.pageObj = {}
        }
      }).catch(() => {
        this.$nuxt.$loading.finish();
        this.$msgBox({
          content: '数据加载失败，请稍后重试',
          isShowCancelBtn: false
        })
      })
    },
    getPage (int) {
      window.scrollTo(0, 0);
      this.obj.pageCurrent = int;
      this.getCourse();
    }
  },
  mounted () {
    if (this.webInfo && this.webInfo.isEnableVip) {
      this.openVip = true
    }
    courseChange(this)
    if (this.$route.query.free) {
      this.obj.isFree = 1
      this.free = 1
    }
    // this.getCourse()
  },
  components: {
    YHeader,
    YFooter,
    YHeaderList,
    DPage,
    RightTap
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.courselist_page {
  .course_content {
    background: rgb(245, 245, 245);
    padding: 30px 0 10px 0;
    ul {
      width: 1200px;
      margin: 0 auto;
    }
    li {
      float: left;
      border-radius: 6px;
      background: #fff;
      margin: 0px 20px 20px 0px;
      &:nth-child(4n) {
        margin-right: 0px;
      }
    }
  }
  .course_info {
    display: block;
    width: 285px;
    height: 240px;
    border-radius: 6px;
    position: relative;
    &:hover {
      text-decoration: none;
      color: #000;
      box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);
      transition: all .3s;
    }
    .img_box {
      position: relative;
      width: 285px;
      height: 140px;
      .qizi {
        background: url(../assets/image/activity/qizi.png) no-repeat center;
        position: absolute;
        top: 0;
        left: 10px;
        width: 46px;
        height: 43px;
        padding-top: 3px;
        color: #fff;
        font-size: 14px;
        text-align: center;
      }
      .course_img {
        width: 285px;
        height: 140px;
        border-radius: 6px 6px 0 0;
      }
    }
    p {
      font-size: 16px;
      margin-top: 5px;
      padding: 0 10px;
      word-break: break-all;
    }
    .price_box {
      font-size: 16px;
      position: absolute;
      bottom: 15px;
      left: 10px;
      color: red;
    }
  }
}
</style>
