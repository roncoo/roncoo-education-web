<template>
  <div>
    <y-header></y-header>
    <div class="person_body container account_cont clearfix">
      <y-side :type="'xxjl'"></y-side>
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab on">学习记录</a>
        </ul>
        <div class="main_cont">
          <div class="notdata" v-if="notdata">
            <i class="iconfont">&#xe6be;</i>暂时没有数据
          </div>
          <table class="course_table table" v-else>
            <thead>
              <tr>
                <th>课程名称</th>
                <th>学习内容</th>
                <th>学习时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in pageObj.list">
                <td>{{item.courseName}}</td>
                <td class="name">{{item.periodName}}</td>
                <td>{{item.gmtCreate}}</td>
              </tr>
            </tbody>
          </table>
          <d-page v-if="pageObj.totalPage > 1" :page="pageObj" @btnClick="getPage"></d-page>
        </div>
      </div>
    </div>
    <y-footer></y-footer>
  </div>
</template>
<script>
  import YHeader from '~/components/common/Header'
  import YFooter from '~/components/common/Footer'
  import YSide from '~/components/account/Side'
  import DPage from '~/components/Page'
  import {studyList} from '~/api/account/user.js'
  export default {
    components: {
      YHeader,
      YFooter,
      YSide,
      DPage
    },
    data () {
      return {
        notdata: true,
        pageCurrent: 1,
        pageObj: {
          pageCurrent: '',
          pageSize: '',
          totalCount: '',
          totalPage: ''
        }
      }
    },
    methods: {
      getPage (int) {
        this.pageCurrent = int
        this.getStudyList()
      },
      getStudyList () {
        studyList({
          pageCurrent: this.pageCurrent,
          pageSize: 20
        }).then(res => {
          let result  = res.data
          console.log(result)
          console.log('study======')
          if (result.code === 200) {
            this.pageObj = result.data
            if (!result.data.list.length) {
              this.notdata = true
            } else {
              this.notdata = false
            }
          } else if (result.code > 300 && result.code < 400) {
            this.notdata = true
            this.$msgBox({
              content: '登录超时，请重新登录',
              isShowCancelBtn: false
            }).then(() => {
              this.$store.dispatch('REDIRECT_LOGIN')
            }).catch(() => {
              this.$store.dispatch('REDIRECT_LOGIN')
            })
          } else {
            this.notdata = true
            this.$msgBox({
              content: result.msg,
              isShowCancelBtn: false
            }).catch(() => {})
          }
        }).catch(() => {
          this.notdata = true
          this.$msgBox({
            content: '系统繁忙，请稍后重试',
            isShowCancelBtn: false
          }).catch(() => {})
        })
      }
    },
    mounted () {
      this.getStudyList()
    }
  }
</script>
<style lang="scss">
  @import '~/assets/css/account.scss';
</style>