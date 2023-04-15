<template>
  <div>
    <y-header />
    <div class="person_body container account_cont clearfix">
      <y-side :type="'wdsc'" />
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab on">我的收藏</a>
        </ul>
        <div class="main_cont">
          <div v-if="notdata" class="notdata">
            <i class="iconfont">&#xe6be;</i>暂时没有数据
          </div>
          <table v-else class="course_table table">
            <tbody>
              <tr v-for="(item, index) in pageObj.list" :key="index">
                <td v-if="item.courseResp">
                  <img :src="item.courseResp.courseLogo" :alt="item.courseResp.courseName" :height="80">
                  <div>
                    <div class="title">{{ item.courseResp.courseName }}</div>
                    <div v-if="item.courseResp.isFree === 1" style="margin: 0">【免费课】</div>
                    <br><br>
                    <div>购买人数：{{ item.courseResp.countBuy }}</div>
                    <br><br>
                    <div>学习人数：{{ item.courseResp.countStudy }}</div>
                  </div>
                </td>
                <td v-if="item.courseResp" style="float: right;margin-top: 10px">
                  <nuxt-link target="_blank" :to="{name: 'course-id', params: {id: item.courseResp.id}}" class="go_btn">马上学习</nuxt-link>
                </td>
              </tr>
            </tbody>
          </table>
          <d-page v-if="pageObj.totalPage > 1" :page="pageObj" @btnClick="getPage" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import YSide from '~/components/account/Side'
import YHeader from '~/components/common/Header'
import DPage from '~/components/common/Page'
import { userCourseCollectPage } from '@/api/user.js'

export default {
  components: {
    YHeader,
    YSide,
    DPage
  },
  data() {
    return {
      notdata: true,
      pageCurrent: 1,
      pageObj: {}
    }
  },
  head() {
    return {
      title: '我的收藏-' + this.$store.state.websiteInfo.websiteName
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getPage(int) {
      this.pageCurrent = int
      this.getList()
    },
    getList() {
      userCourseCollectPage({ pageCurrent: this.pageCurrent, pageSize: 20 }).then(res => {
        if (res.totalCount > 0) {
          this.notdata = false
          this.pageObj = res
          console.log('res', res)
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import '~/assets/css/account.scss';
</style>
