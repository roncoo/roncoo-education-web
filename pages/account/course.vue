<template>
  <div>
    <y-header></y-header>
    <div class="person_body clearfix">
      <y-side :type="'kcgl'"></y-side>
      <div class="person_content">
        <ul class="person_title clearfix">
          <li :class="{now: tab == 3}"><a href="javascript:" @click="clicktab(3)">全部课程</a></li>
          <li :class="{now: tab == 1}"><a href="javascript:" @click="clicktab(1)">审核通过</a></li>
          <li :class="{now: tab == 0}"><a href="javascript:" @click="clicktab(0)">审核中</a></li>
          <li :class="{now: tab == 2}"><a href="javascript:" @click="clicktab(2)">审核失败</a></li>
          <nuxt-link :to="{name:'courseAdd'}" class="add_course">新增课程</nuxt-link>
        </ul>
        <div class="notdata" v-if="notdata">
          <i class="iconfont">&#xe6be;</i>暂时没有数据
        </div>
        <div class="person_info" v-else>
          <ul class="course_manage_title clearfix">
            <li class="course_info">课程信息</li>
            <li class="is_pay">是否付费</li>
            <li class="pirce">价格</li>
            <li class="statu">状态</li>
            <li class="up_down">上下架</li>
            <li class="operate">操作</li>
          </ul>
          <ul class="course_manage_info clearfix" v-for="(item, index) in courseList" :key="index">
            <li class="course_info">
              <div class="img_box">
                <img :src="item.courseLogo" alt="">
              </div>
              <p>{{item.courseName}}</p>
            </li>
            <li class="is_pay" v-if="item.isFree">免费</li>
            <li class="is_pay" v-else>付费</li>
            <li class="pirce">
              ￥{{item.courseOriginal}}
              <p class="mgt10 c_gold" v-if="webInfo && webInfo.isEnableVip">SVIP:￥{{item.courseDiscount}}</p>
            </li>
            <li class="statu c_green" v-if="item.auditStatus === 1">审核通过</li>
            <li class="statu c_red" v-else-if="item.auditStatus === 2">审核不通过（{{item.auditOpinion}}）</li>
            <li class="statu c_blue" v-else>待审核</li>
            <li class="up_down">
              <input type="button" @click="putaWay(item)" value="下架" v-if="item.isPutaway">
              <input type="button" @click="putaWay(item)" value="上架" v-else>
            </li>
            <li class="operate">
              <nuxt-link :to="{name: 'courseAdd', query: {no: item.id}}">修改</nuxt-link>
              <nuxt-link :to="{name: 'coursePeriod', query: {no: item.courseNo}}">章节管理</nuxt-link>
              <a href="javascript:" @click="deleteTeacherCourse(item.id)" v-if="item.isDelete">删除</a>
            </li>
          </ul>
          <!-- <d-page v-if="pageObj.totalPage > 1" :page="pageObj" @btnClick="getPage"></d-page> -->
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
// import DPage from '~/components/Page'
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
        lecturerUserNo: this.$store.state.userInfo.userNo,
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
    deleteTeacherCourse (id) {
      this.$msgBox({
        content: '确认删除该课程？'
      }).then(() => {
        deleteCourse({id}).then(res => {
          // console.log(res)
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
                content: '登陆超时，请重新登陆',
                isShowCancelBtn: false
              }).then(() => {
                this.$store.commit('SET_TEMPORARYURL')
                this.$store.commit('SIGN_OUT')
                this.$router.push({name: 'login'})
              }).catch(() => {})
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
          console.log(result)
          if (result.code === 200) {
            item.isPutaway = isp;
          } else {
            if (result.code >= 300 && result.code < 400) {
              this.$msgBox({
                content: '登陆超时，请重新登陆',
                isShowCancelBtn: false
              }).then(() => {
                this.$store.commit('SET_TEMPORARYURL')
                this.$store.commit('SIGN_OUT')
                this.$router.push({name: 'login'})
              }).catch(() => {})
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
      console.log(this.pda)
      lecturerCourseList(this.pda).then(res => {
        let result = res.data
        console.log(result)
        console.log('course----')
        if (result.code === 200 && result.data.list.length > 0) {
          this.courseList = result.data.list;
          this.notdata = false;
          this.pageObj = result.data;
        } else if (result.code > 300 && result.code <400) {
          this.$msgBox({
            content: '登陆超时，请重新登陆',
            isShowCancelBtn: false
          }).then(() => {
            this.$store.commit('SET_TEMPORARYURL')
            this.$store.commit('SIGN_OUT')
            this.$router.push({name: 'login'})
          }).catch(() => {})
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
  },
  created () {
  },
  components: {
    YHeader,
    YFooter,
    YSide
    // DPage
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .person_body {
    width: 1200px;
    margin: 30px auto 0;
    min-height: 1000px;
  }
  .person_content {
    width: 1012px;
    float: right;
    background: #fff;
    border-radius: 6px;
  }
  .person_title {
    border-bottom: 1px solid rgb(242, 242, 242);
    position: relative;
    li {
      float: left;
      line-height: 60px;
      padding: 0 30px;
      font-size: 14px;
      &.now {
        border-bottom: 2px solid #D51423;
        a {
          color: #D51423;
        }
      }
      a:hover {
        color: #D51423;
      }
    }
    .add_course {
      position: absolute;
      display: inline-block;
      width: 106px;
      line-height: 36px;
      background: rgba(213, 20, 35, 1);
      border-radius: 6px;
      color: #fff;
      text-align: center;
      font-size: 14px;
      right: 25px;
      top: 12px;
    }
  }
  .person_info {
    padding: 25px;
    min-height: 400px;
  }
  .course_manage_title {
    background: rgba(245, 245, 245, 1);
    li {
      line-height: 36px;
      float: left;
      text-align: center;
      color: #333;
      font-size: 13px;
    }
  }
  .course_info {
    width: 403px;
  }
  .is_pay, .pirce, .statu, .up_down {
    width: 108px;
    text-align: center;
  }
  .operate {
    width: 111px;
    text-align: center;
  }
  .course_manage_info {
    border-bottom: 2px solid rgba(245, 245, 245, 1);
    li {
      padding: 20px 0;
      float: left;
      font-size: 14px;
      &.pirce {
        color: #D51423;
        .c_gold {
          color: #CA9E70;
        }
      }
      &.statu {
        color: #6CB438;
      }
    }
    .course_info {
      position: relative;
      .img_box {
        width: 175px;
        height: 86px;
        margin-left: 20px;
        display: inline-block;
      }
      img {
        width: 175px;
        height: 86px;
      }
      p {
        width: 175px;
        position: absolute;
        left: 215px;
        top: 25px;
      }
    }
    .up_down {
      input {
        color: #D51423;
        border: 1px solid #D51423;
        width: 64px;
        height: 24px;
        border-radius: 6px;
        background: #fff;
        font-size: 14px;
        cursor: pointer;
        margin-top: -2px;
        &.is_down {
          border: 1px solid #999;
          color: #999;
        }
      }
    }
    .operate {
      a {
        color: #0099FF;
        display: block;
        margin-bottom: 12px;
        &:hover {
          text-decoration: none;
        }
      }
    }
  }
  .notdata{
    text-align: center;
    padding: 60px 0;
    font-size: 30px;
    i{
      font-size: 30px;
      padding-right: 12px;
    }
  }
</style>
