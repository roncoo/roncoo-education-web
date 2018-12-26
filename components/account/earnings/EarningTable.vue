<template>
  <div class="earning_table">
    <ul class="tabs clearfix">
      <a class="tab" :class="{on: tab == 1}" @click="clicktab(1)">订单收益</a>
      <a class="tab" :class="{on: tab == 2}" @click="clicktab(2)">提现记录</a>
    </ul>
    <div class="main_cont">
      <div class="notdata" v-if="notdata">
        <i class="iconfont">&#xe6be;</i>暂时没有数据
      </div>
      <table class="course_table table" v-else-if="tab == 1">
        <thead>
          <tr>
            <th>订单号</th>
            <th>课程信息</th>
            <th>购买时间</th>
            <th>购买人</th>
            <th>价格</th>
            <th>收入</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in pageObj.list" :key="index">
            <td>{{item.orderNo}}</td>
            <td class="name">{{item.courseName}}</td>
            <td>{{item.payTime}}</td>
            <td>{{item.mobile}}</td>
            <td class="c_red">{{'￥' + item.pricePaid}}</td>
            <td class="c_red">{{'￥' + item.lecturerProfit}}</td>
          </tr>
        </tbody>
      </table>
      <table class="course_table table" v-else-if="tab == 2">
        <thead>
          <tr>
            <th>申请时间</th>
            <th>金额</th>
            <th>银行卡账号</th>
            <th>开户人</th>
            <th>手续费</th>
            <th>讲师收入</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in pageObj.list" :key="index">
            <td>{{item.gmtCreate}}</td>
            <td class="c_red">{{item.lecturerProfit}}</td>
            <td>{{item.bankCardNo}}</td>
            <td>{{item.bankUserName}}</td>
            <td class="c_red">{{'￥' + item.platformProfit}}</td>
            <td class="c_red">{{'￥' + item.lecturerProfit}}</td>
            <td v-if="item.profitStatus == 1">确认中</td>
            <td v-if="item.profitStatus == 2">完成</td>
            <td v-if="item.profitStatus == 3">失败</td>
          </tr>
        </tbody>
      </table>
      <d-page v-if="pageObj.totalPage > 1" :page="pageObj" @btnClick="getPage"></d-page>
    </div>
  </div>
</template>
<script>
  import DPage from '~/components/Page'
  import {teacherOrderList, teacherCashList} from '~/api/account/user.js'
  export default {
    components: {
      DPage
    },
    data () {
      return {
        tab: 1,
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
      // tab切换
      clicktab (tab) {
        this.tab = tab
        this.pageCurrent = 1
        if (this.tab == 1) {
          this.getTeacherOrderList()
        } else if (this.tab == 2) {
          this.getTeacherCashList()
        }
      },
      // 分页
      getPage (int) {
        this.pageCurrent = int;
        if (this.tab == 1) {
          this.getTeacherOrderList()
        } else if (this.tab == 2) {
          this.getTeacherCashList()
        }
      },
      // 获取订单收益列表
      getTeacherOrderList () {
        teacherOrderList({
          lecturerUserNo: this.$store.state.userInfo.userNo,
          pageCurrent: this.pageCurrent,
          pageSize: 10
        }).then(res => {
          let result  = res.data
          console.log(result)
          console.log('order======')
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
      },
      // 获取提现记录
      getTeacherCashList () {
        teacherCashList({
          lecturerUserNo: this.$store.state.userInfo.userNo,
          pageCurrent: this.pageCurrent,
          pageSize: 10
        }).then(res => {
          let result  = res.data
          console.log(result)
          console.log('chsh======')
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
      this.getTeacherOrderList()
    }
  }
</script>
<style lang="scss" scoped>
  .earning_table {
    margin-top: 30px;
    background: #fff;
    border-radius: 8px;
  }
  .notdata {
    text-align: center;
    font-size: 30px;
    i {
      font-size: 30px;
      margin-right: 10px;
    }
  }
</style>