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
  import {myHttp} from '~/utils/myhttp.js'
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
        myHttp.call(this, {
          method: teacherOrderList,
          params: {
            lecturerUserNo: this.$store.state.userInfo.userNo,
            pageCurrent: this.pageCurrent,
            pageSize: 10
          }
        }).then(res => {
          this.pageObj = res.data
          if (!res.data.list.length) {
            this.notdata = true
          } else {
            this.notdata = false
          }
        })
      },
      // 获取提现记录
      getTeacherCashList () {
        myHttp.call(this, {
          method: teacherCashList,
          params: {
            lecturerUserNo: this.$store.state.userInfo.userNo,
            pageCurrent: this.pageCurrent,
            pageSize: 10
          }
        }).then(res => {
          this.pageObj = res.data
          if (!res.data.list.length) {
            this.notdata = true
          } else {
            this.notdata = false
          }
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