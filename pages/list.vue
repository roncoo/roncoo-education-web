<template>
  <div class="courselist_page">
    <y-header />
    <y-choose :class-list="categoryList" :current-id="obj.categoryId" />
    <div class="course_content">
      <ul class="clearfix">
        <li v-for="(item, index) in pageObj.list" :key="index">
          <nuxt-link target="_blank" :to="{name: 'course-id', params: {id: item.id}}" class="course_info">
            <div class="img_box">
              <img class="course_img" :src="item.courseLogo" alt="">
            </div>
            <p>{{ item.courseName }}</p>
            <span v-if="item.coursePrice === 0" class="price_box">免费</span>
            <span v-else class="price_box">￥{{ item.coursePrice }} <span style="text-decoration-line: line-through;font-size: 12px">￥{{ item.rulingPrice }}</span></span>
          </nuxt-link>
        </li>
      </ul>
      <d-page v-if="pageObj.totalPage > 1" :page="pageObj" @btnClick="getPage" />
    </div>
    <!-- <bottom /> -->
    <y-tap />
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YChoose from '@/components/common/Choose'
import DPage from '~/components/common/Page'
import YTap from '@/components/common/Top'
import { courseList } from '~/api/course.js'
import { categoryList } from '~/api/main.js'
import { courseChange } from '~/utils/commonfun.js'
// import Bottom from '@/components/common/Bottom'

export default {
  components: {
    // Bottom,
    YHeader,
    YChoose,
    DPage,
    YTap
  },
  async asyncData(context) {
    const dataObj = {}
    dataObj.websiteInfo = context.store.state.websiteInfo
    let categoryId = ''
    categoryId = context.query.categoryId || ''
    if (context.query.categoryTwoId) {
      categoryId = context.query.categoryTwoId
    }
    if (context.query.categoryThreeId) {
      categoryId = context.query.categoryThreeId
    }
    const obj = {
      pageCurrent: 1,
      pageSize: 20,
      categoryId
    }
    console.log('obj', obj)
    try {
      const allData = await Promise.all([courseList(obj), categoryList()])
      // 课程分页
      dataObj.pageObj = allData[0]
      console.log('pageObj', dataObj.pageObj)
      // 分类
      dataObj.categoryList = await allData[1]
      dataObj.obj = {
        pageCurrent: 1,
        pageSize: 20
      }
      return dataObj
    } catch (e) {
      context.error({ message: 'Data not found', statusCode: 404 })
    }
  },
  data() {
    return {
      categoryId: '', // 当前分类ID
      categoryList: []
    }
  },
  head() {
    return {
      title: '课程中心-' + this.$store.state.websiteInfo.websiteName,
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
  watch: {
    '$route'() {
      courseChange(this)
      this.getCourse()
    }
  },
  created() {
    // const path = this.$route.path // 先获取路由路径
    // this.$router.push(path)
    // courseChange(this)
    // this.getCourse()
    console.log('categoryList', this.categoryList)
  },
  methods: {
    getCourse() {
      if (this.obj.categoryId === '') {
        delete this.obj.categoryId
      }
      // this.$nuxt.$loading.start()
      courseList(this.obj).then(res => {
        // this.$nuxt.$loading.finish()
        if (res) {
          this.pageObj = res
        } else {
          this.pageObj = {}
        }
      }).catch(() => {
        // this.$nuxt.$loading.finish()
        this.$msgBox({
          content: '数据加载失败，请稍后重试',
          isShowCancelBtn: false
        })
      })
    },
    getPage(int) {
      window.scrollTo(0, 0)
      this.obj.pageCurrent = int
      this.getCourse()
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.courselist_page {
  .course_content {
    background: #f6f8fb;
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
      height: 158px;

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
        height: 158px;
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
