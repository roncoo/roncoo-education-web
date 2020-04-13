<template>
  <div>
    <y-header></y-header>
    <div class="person_body container account_cont clearfix">
      <y-side :type="'kcgl'"></y-side>
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab" :class="{on: tab == 3}" @click="clicktab(3)">全部课程</a>
          <a class="tab" :class="{on: tab == 1}" @click="clicktab(1)">审核通过</a>
          <a class="tab" :class="{on: tab == 0}" @click="clicktab(0)">审核中</a>
          <a class="tab" :class="{on: tab == 2}" @click="clicktab(2)">审核失败</a>
          <nuxt-link :to="{name:'account-teacher-add'}" class="fr solid_btn">新增课程</nuxt-link>
        </ul>
        <div class="main_cont">
          <div class="notdata" v-if="notdata">
            <i class="iconfont">&#xe6be;</i>暂时没有数据
          </div>
          <table class="course_table table" v-else>
            <thead>
              <tr>
                <th>课程名称</th>
                <th>是否付费</th>
                <th>价格</th>
                <th>状态</th>
                <th>上下架</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in courseList" :key="item.courseNo">
                <td class="name"><img class="icon" :src="item.courseLogo" alt="">
                  <p class="fr txt">{{item.courseName}}</p></td>
                <td class="c_orange" v-if="item.isFree">免费</td>
                <td class="c_orange" v-else>付费</td>
                <td class="c_red">¥{{item.courseOriginal}}</td>
                <td class="c_green" v-if="item.auditStatus === 1">审核通过</td>
                <td class="c_red" v-else-if="item.auditStatus === 2">审核不通过</td>
                <td class="c_blue" v-else>待审核</td>
                <td v-if="item.isPutaway"><button class="gray_btn" @click="putaWay(item)">课程下架</button></td>
                <td v-else><button class="orange_btn" @click="putaWay(item)">课程上架</button></td>
                <td class="operate">
                  <span>
                    <router-link :to="{ name: 'account-teacher-add', query: { no: item.id }}" class="text_link">修改</router-link>
                  </span>
                  <br>
                  <span>
                    <router-link :to="'/account/teacher/period?no=' +item.id" class="text_link">课时管理</router-link>
                  </span>
                  <br>
                  <span>
                    <a v-if="item.isDelete" @click="deleteItem(item.id)" href="javascript:" class="text_link">删除</a>
                  </span>
                </td>
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
import {lecturerCourseList, coursePutaway, deleteCourse} from '~/api/account/course.js'
import {getUserInfo} from '~/api/user.js'
export default {
  data () {
    return {
      side: 'kcgl',
      tab: 3,
      notdata: true,
      pageCurrent: 1,
      courseList: [],
      pda: {
        courseCategory: 1,
        auditStatus: '',
        lecturerUserNo: '',
        pageCurrent: 1,
        pageSize: 20
      },
      pageObj: {
        pageCurrent: '',
        pageSize: '',
        totalCount: '',
        totalPage: ''
      }
    }
  },
  computed: {
    webInfo () {
      return this.$store.state.webInfo
    }
  },
  methods: {
    // 删除课程
    deleteItem (id) {
      this.$msgBox({
        content: '确认删除该课程？'
      }).then(() => {
        deleteCourse({id}).then(res => {
          let result = res.data
          if (result.code === 200) {
            this.$msgBox({
              content: '删除成功',
              isShowCancelBtn: false
            })
            this.getCourseList()
          } else {
            if (result.code >= 300 && result.code < 400) {
              this.$msgBox({
                content: '登录超时，请重新登录',
                isShowCancelBtn: false
              }).then(() => {
                this.$store.dispatch('REDIRECT_LOGIN', result.code)
              }).catch(() => {
                this.$store.dispatch('REDIRECT_LOGIN', result.code)
              })
            } else {
              this.$msgBox({
                content: result.msg,
                isShowCancelBtn: false
              }).catch(() => {})
            }
          }
        }).catch(() => {
        })
      }).catch(() => {
        // console.log('取消')
      })
    },
    getPage: function (int) {
      this.pageCurrent = int;
      this.getCourseList();
    },
    // 课程上下架
    putaWay (item) {
      // console.log(item)
      let isp = item.isPutaway ? 0 : 1;
      let txt = '确定下架该课程';
      if (isp) {
        txt = '确定上架该课程?'
      }
      this.$msgBox({
        content: txt
      }).then(res => {
        coursePutaway({
          id: item.id,
          isPutaway: isp
        }).then(res => {
          let result = res.data
          if (result.code === 200) {
            item.isPutaway = isp;
          } else {
            if (result.code >= 300 && result.code < 400) {
              this.$msgBox({
                content: '登录超时，请重新登录',
                isShowCancelBtn: false
              }).then(() => {
                this.$store.dispatch('REDIRECT_LOGIN', result.code)
              }).catch(() => {
                this.$store.dispatch('REDIRECT_LOGIN', result.code)
              })
            } else {
              this.$msgBox({
                content: result.msg,
                isShowCancelBtn: false
              }).catch(() => {})
            }
          }
        }).catch(msg => {
        this.$msgBox({
          content: '操作失败',
          isShowCancelBtn: false
        })
      })
      })
    },
    clicktab: function (int) {
      this.tab = int;
      this.pageCurrent = 1;
      this.getCourseList();
    },
    getCourseList () {
      let astat = this.tab === 3 ? '' : this.tab;
      this.pda.auditStatus = astat;
      this.pda.pageCurrent = this.pageCurrent;
      lecturerCourseList(this.pda).then(res => {
        let result = res.data
        if (result.code === 200 && result.data.list.length > 0) {
          this.courseList = result.data.list;
          this.notdata = false;
          this.pageObj = result.data;
        } else if (result.code > 300 && result.code <400) {
          this.$msgBox({
            content: '登录超时，请重新登录',
            isShowCancelBtn: false
          }).then(() => {
            this.$store.dispatch('REDIRECT_LOGIN', result.code)
          }).catch(() => {
            this.$store.dispatch('REDIRECT_LOGIN', result.code)
          })
        } else {
          this.notdata = true;
          this.pageObj.totalPage = 0;
        }
      }).catch(msg => {
        this.$msgBox({
          content: '加载数据失败，请稍后刷新再试！！',
          isShowCancelBtn: false
        })
      })
    }
  },
  mounted () {
    // console.log('课程列表')
    this.getCourseList();
    this.pda.lecturerUserNo = this.$store.state.userInfo.userNo;
  },
  created () {
  },
  components: {
    YHeader,
    YFooter,
    YSide,
    DPage
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
@import '~/assets/css/account.scss';
  .course_table{
    .name{
      width: 400px;
      .txt{
        width: 190px;
        padding-top: 12px;
        font-size: 14px;
      }
    }
    .icon{
      width: 175px;
      vertical-align: middle;
    }
  }
</style>
