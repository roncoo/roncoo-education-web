<template>
  <div>
    <y-header />
    <div class="container account_cont clearfix">
      <y-side :type="'wddd'" />
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab" :class="{on: num == 0}" @click="clicktab(0)">所有订单</a>
          <a class="tab" :class="{on: num == 1}" @click="clicktab(1)">待支付订单</a>
          <a class="tab" :class="{on: num == 2}" @click="clicktab(2)">已完成订单</a>
        </ul>
        <div v-if="notdata" class="notdata">
          <i class="iconfont">&#xe6be;</i>暂时没有数据
        </div>
        <div v-if="!notdata" class="person_info">
          <div v-for="(item, index) in pageObj.list" :key="index" class="order_content">
            <div class="order_title clearfix">
              <span class="order_num">订单号：{{ item.orderNo }}</span>
              <span class="time">{{ item.gmtCreate }}</span>
            </div>
            <div class="order_body clearfix">
              <div class="body_left clearfix">
                <nuxt-link target="_blank" :to="{name: 'course-id', params: {id: item.courseId}}">
                  <div v-if="item.courseLogo" class="img_box fl">
                    <img :src="item.courseLogo" :alt="item.courseName">
                  </div>
                  <p class="fl">
                    {{ item.courseName }}<br><br>
                    原价：<span style="text-decoration-line: line-through; margin-right: 20px">￥{{ item.rulingPrice }}</span>实付：￥{{ item.coursePrice }}
                  </p>
                </nuxt-link>
              </div>
              <ul class="body_right clearfix">
                <li>
                  <br>
                  <span v-if="item.orderStatus == 1">待支付</span>
                  <span v-if="item.orderStatus == 2"><nuxt-link target="_blank" :to="{name: 'course-id', params: {id: item.courseId}}" class="go_btn">马上学习</nuxt-link></span>
                  <span v-if="item.orderStatus == 3">支付失败</span>
                  <span v-if="item.orderStatus == 4">已关闭</span>
                </li>
                <li v-if="item.orderStatus == 1 || item.orderStatus == 3">
                  <a href="javascript:" class="go_btn go_pay" @click="continuePay(item)">继续支付</a>
                  <a href="javascript:" class="cancel" @click="closeOrder(item.orderNo)">关闭订单</a>
                </li>
              </ul>
            </div>
          </div>
          <d-page v-if="pageObj.totalPage > 1 && !notdata" :page="pageObj" @btnClick="getPage" />
        </div>
      </div>
    </div>
    <d-paymodal v-if="showPay" class="" :data="payData" @hidefun="showPay = false" />
    <!-- <bottom /> -->
  </div>
</template>
<script>
import YSide from '~/components/account/Side'
import YHeader from '~/components/common/Header'
import DPaymodal from '@/components/common/Order'
import { cancelOrder, orderPage } from '@/api/user.js'
import DPage from '~/components/common/Page'
// import Bottom from '@/components/common/Bottom'

export default {
  components: {
    // Bottom,
    YHeader,
    YSide,
    DPage,
    DPaymodal
  },
  data() {
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
  head() {
    return {
      title: '我的订单-' + this.$store.state.websiteInfo.websiteName
    }
  },
  mounted() {
    this.obj = {
      orderStatus: '',
      pageCurrent: 1,
      pageSize: 10
    }
    this.getOrderList()
  },
  methods: {
    continuePay(item) {
      this.payData = item
      this.showPay = true
    },
    clicktab(int) {
      this.num = int
      if (int === 0) {
        this.obj.orderStatus = ''
      } else {
        this.obj.orderStatus = int
      }
      this.obj.pageCurrent = 1
      this.getOrderList()
    },
    getPage: function(int) {
      this.obj.pageCurrent = int
      this.getOrderList()
    },
    getOrderList() {
      orderPage(this.obj).then(res => {
        if (res.totalCount > 0) {
          this.notdata = false
          this.pageObj = res
        }
      })
    },
    closeOrder(orderNo) {
      cancelOrder({ orderNo: orderNo }).then(res => {
        this.$msgBox({
          content: '关闭成功',
          isShowCancelBtn: false,
          edit: false
        }).then(async(val) => {
          this.getOrderList()
        }).catch(() => {
          this.getOrderList()
        })
      })
    }
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

.page {
  margin-bottom: 20px;
  margin-top: 10px;
}
</style>
