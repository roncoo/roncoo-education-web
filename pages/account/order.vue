<template>
  <div>
    <y-header></y-header>
    <div class="container account_cont clearfix">
      <y-side :type="'wddd'"></y-side>
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab" :class="{on: num == 0}" @click="clicktab(0)">所有订单</a>
          <a class="tab" :class="{on: num == 1}" @click="clicktab(1)">待支付订单</a>
          <a class="tab" :class="{on: num == 2}" @click="clicktab(2)">已完成订单</a>
        </ul>
        <div class="notdata" v-if="notdata">
          <i class="iconfont">&#xe6be;</i>暂时没有数据
        </div>
        <div class="person_info" v-if="!notdata">
          <div class="order_content" v-for="(item, index) in pageObj.list" :key="index">
            <div class="order_title clearfix">
              <span class="order_num">订单号：{{item.orderNo}}</span>
              <span class="time">{{item.gmtCreate}}</span>
            </div>
            <div class="order_body clearfix">
              <div class="body_left clearfix">
                <div class="img_box fl" v-if="item.courseLogo">
                  <img :src="item.courseLogo" alt="">
                </div>
                <p class="fl">
                  {{item.courseName}}
                </p>
              </div>
              <ul class="body_right clearfix">
                <li class="money">￥{{item.pricePaid}}</li>
                <li v-if="item.payType == 1">微信支付</li>
                <li v-if="item.payType == 2">支付宝支付</li>
                <li class="alipay" v-if="item.orderStatus == 1">等待支付</li>
                <li class="alipay" v-if="item.orderStatus == 2">已支付</li>
                <li class="alipay" v-if="item.orderStatus == 3">支付失败</li>
                <li class="alipay" v-if="item.orderStatus == 4">已关闭</li>
                <li class="alipay" v-if="item.orderStatus == 5">已退款</li>
                <li class="alipay" v-if="item.orderStatus == 6">已解绑</li>
                <li v-if="item.orderStatus == 2">
                  <nuxt-link :to="{name: 'view-id', params: {id: item.courseId}}" class="go_btn">进入学习</nuxt-link>
                </li>
                <li v-else-if="item.orderStatus == 1 || item.orderStatus == 3">
                  <a href="javascript:" class="go_btn go_pay" @click="pay(item)">继续支付</a>
                  <a href="javascript:" class="cancel" @click="closeOrder(item.orderNo)">取消支付</a>
                </li>
              </ul>
            </div>
          </div>
          <d-page v-if="pageObj.totalPage > 1 && !notdata" :page="pageObj" @btnClick="getPage"></d-page>
        </div>
      </div>
    </div>
    <d-paymodal class="" :data="payData" @hidefun="showPay = false" v-if="showPay"></d-paymodal>
    <y-footer></y-footer>
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YFooter from '~/components/common/Footer'
import YSide from '~/components/account/Side'
import DPaymodal from '~/components/account/PayModal'
import {orderList, orderClose} from '~/api/account/course.js'
import DPage from '~/components/Page'
import {myHttp} from '~/utils/myhttp.js'
export default {
  data () {
    return {
      num: 0,
      showPay: false,
      payData: null,
      notdata: true,
      obj: {
        orderStatus: 0,
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
  methods: {
    pay (item) {
      this.payData = item;
      this.showPay = true;
    },
    clicktab (int) {
      this.num = int;
      this.obj.orderStatus = int;
      this.obj.pageCurrent = 1;
      this.getOrderList();
    },
    getPage: function (int) {
      this.obj.pageCurrent = int;
      this.getOrderList();
    },
    getOrderList () {
      this.obj.lecturerUserNo = this.$store.state.userInfo.userNo
      myHttp.call(this, {
        method: orderList,
        params: this.obj
      }).then(res => {
        this.pageObj = res.data;
        if (res.data.list.length > 0) {
          this.notdata = false;
        } else {
          this.notdata = true;
        }
      })
    },
    closeOrder (orderNo) {
      myHttp.call(this, {
        method: orderClose,
        params: {orderNo}
      }).then(res => {
        this.$msgBox({
          content: '取消成功',
          isShowCancelBtn: false,
          edit: false
        }).then(async (val) => {
          this.getOrderList()
        }).catch(() => {
          this.getOrderList()
        })
      })
    }
  },
  mounted () {
    this.obj = {
      orderStatus: 0,
      pageCurrent: 1,
      pageSize: 10
    }
    this.getOrderList();
  },
  components: {
    YHeader,
    YFooter,
    YSide,
    DPage,
    DPaymodal
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import '~/assets/css/account.scss';
  .person_info {
    padding: 25px;
    min-height: 400px;
  }
  .order_content {
    border-bottom: 2px solid rgba(245, 245, 245, 1);
    margin-top: 20px;
    position: relative;
    &:first-child {
      margin-top: 0;
    }
  }
  .order_title {
    line-height: 36px;
    padding-left: 20px;
    background: rgba(245, 245, 245, 1);
    font-size: 14px;
    color: #999;
    .order_type {
      margin-right: 10px;
      color: #0099FF;
    }
    .time {
      margin-left: 30px;
    }
  }
  .order_body {
    margin: 15px 0;
  }
  .body_left {
    padding: 0 20px;
    float: left;
    // position: relative;
    .img_box {
      width: 120px;
      height: 59px;
      display: inline-block;
    }
    img {
      width: 120px;
      height: 59px;
    }
    p {
      // position: absolute;
      width: 336px;
      white-space: inherit;
      margin-left: 10px;
      // left: 160px;
      font-size: 14px;
      color: #999;
    }
  }
  .body_right {
    float: right;
    li {
      float: left;
      height: 59px;
      width: 100px;
      text-align: center;
      border-left: 2px solid rgba(245, 245, 245, 1);
      font-size: 14px;
      color: #999;
      &.alipay {
        color: #0099FF;
      }
      &.money {
        color: #D51423;
      }
      .cancel {
        display: block;
        text-align: center;
        margin-top: 5px;
        color: #999;
        &:hover {
          color: #D51423;
        }
      }
      .go_btn {
        display: block;
        width: 76px;
        height: 30px;
        margin-left: 10px;
        line-height: 30px;
        background: #fff;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        color: #999;
        border: 1px solid #999;
        &.go_pay {
          border-color: orange;
          color: orange;
        }
        &:hover {
          color: #D51423;
          border-color: #D51423;
        }
      }
    }
  }
  .notdata{
    text-align: center;
    padding: 60px 0;
    font-size: 30px;
    color: #999;
    min-height: 400px;
    i{
      font-size: 30px;
      padding-right: 12px;
    }
  }
  .page {
     margin-bottom: 20px;
     margin-top: 10px;
  }
</style>
