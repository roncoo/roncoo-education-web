<template>
  <div class="search_page">
    <y-header :active="'search'" :hide-search="true" :search-text="$route.query.search" />
    <div class="search_input">
      <div class="search_box_content clearfix">
        <div class="form">
          <span class="iconfont"></span>
          <input v-model="map.courseName" type="text" class="search_box_input" @keyup.enter="handleSearch">
          <button class="search_btn" @click="handleSearch">搜索</button>
        </div>
      </div>
    </div>
    <div class="search_content">
      <ul v-if="opts.list && opts.list.length > 0" class="clearfix">
        <li v-for="(item, index) in opts.list" :key="index">
          <nuxt-link target="_blank" :to="{name: 'course-id', params: {id: item.id}}" class="course_info">
            <div class="img_box">
              <img class="course_img" :src="item.courseLogo" alt="">
            </div>
            <p v-html="item.courseName" />
            <span v-if="item.coursePrice === 0" class="price_box">免费</span>
            <span v-else class="price_box">￥{{ item.coursePrice }}</span>
          </nuxt-link>
        </li>
      </ul>
      <div v-if="!opts.list || opts.list.length === 0" class="no_data">
        暂无数据
      </div>
      <d-page v-if="page.totalPage > 1" :page="page" @btnClick="getPage" />
    </div>
    <!-- <bottom /> -->
    <right-tap />
  </div>
</template>

<script>
import YHeader from '~/components/common/Header'
import RightTap from '@/components/common/Top'
import { courseList } from '~/api/course'
import DPage from '~/components/common/Page'

export default {
  name: 'Search',
  components: {
    YHeader,
    DPage,
    RightTap
  },
  async asyncData(context) {
    const dataObj = {
      map: {
        courseName: '',
        isHfield: 1
      },
      opts: {
        list: []
      },
      page: {
        pageCurrent: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      }
    }
    dataObj.websiteInfo = context.store.state.websiteInfo
    try {
      dataObj.map.courseName = context.query.search
      const res = await courseList(dataObj.map, dataObj.page.pageCurrent, dataObj.page.pageSize)
      dataObj.opts.list = res.list || []
      dataObj.page.pageCurrent = res.pageCurrent || 1
      dataObj.page.totalPage = res.totalPage || 1
      dataObj.page.totalCount = res.totalCount || 0
      return dataObj
    } catch (e) {
      context.error({ message: 'Data not found', statusCode: 404 })
    }
  },
  data() {
    return {
      openVip: false,

      ctrl: {
        loading: false
      }

    }
  },
  head() {
    return {
      title: '搜索页面-' + this.$store.state.websiteInfo.websiteName,
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
      this.getList()
    }
  },
  mounted() {
    if (this.websiteInfo && this.websiteInfo.isEnableVip) {
      this.openVip = true
    }
  },
  methods: {
    getPage(int) {
      window.scrollTo(0, 0)
      this.page.pageCurrent = int
      this.getList()
    },
    handleSearch() {
      this.getList()
    },
    getList() {
      this.ctrl.loading = true
      courseList(this.map, this.page.pageCurrent, this.page.pageSize).then(res => {
        this.ctrl.loading = false
        this.opts.list = res.list || []
        this.page.pageCurrent = res.pageCurrent
        this.page.totalPage = res.totalPage || 1
        this.page.totalCount = res.totalCount
      }).catch(() => {
        this.ctrl.loading = false
        this.opts.list = []
        this.page.pageCurrent = 1
        this.page.totalPage = 1
        this.page.totalCount = 0
      })
    }
  }
}
</script>

<style scoped lang="scss">
// .search_page {
//   min-height: 100vh;
// }

@keyframes bganimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.search_input {
  padding: 33px 0;
  background-image: linear-gradient(125deg, #F44336, #E91E63, #9C27B0, #3F51B5, #2196F3);
  animation: bganimation 15s infinite;

  .search_box_content {
    width: 607px;
    margin: 0 auto;
  }

  .form {
    width: 100%;

    position: relative;

    .iconfont {
      position: absolute;
      left: 10px;
      top: 2px;
      line-height: 44px;
      font-size: 22px;
      margin-right: 2px;
      color: #999;
      font-weight: 700;
    }

    .search_box_input {
      width: 505px;
      padding-left: 40px;
      height: 44px;
      line-height: 44px;
      background: #fff;
      border-radius: 6px 0 0 6px;
      font-size: 13px;
      color: #333;
    }

    .search_btn {
      width: 96px;
      height: 44px;
      background-color: #47a6ee;
      color: #fff;
      font-weight: 700;
      border-radius: 0 6px 6px 0;
      position: relative;
      top: 2px;
      left: -5px;
      border: none;
      font-size: 14px;
      cursor: pointer;
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

.search_content {
  background: #f6f8fb;
  padding: 30px 0 10px 0;
  min-height: calc(100vh - 130px - 120px - 380px - 1px);

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

.no_data {
  text-align: center;
  width: 1200px;
  font-size: 20px;
  line-height: 100px;
  color: #999;
  background: #fff;
  margin: 20px auto;
  border-radius: 6px;
  box-shadow: 0 4px 10px 0 rgb(0 0 0 / 5%);
}
</style>
