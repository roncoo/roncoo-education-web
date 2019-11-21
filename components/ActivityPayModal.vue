<template>
  <div>
    <div class="model" @click="close"></div>
    <div class="pay_box font_14" v-if="payStep === 0">
      <div class="clearfix box_title b_245">
        <span class="fl font_b">订单详情</span>
        <span class="fr iconfont close" @click="close()">&#xe616;</span>
      </div>
      <div class="clesrfix center h36 b_245">
        <div class="fl w60">课程信息</div>
        <div class="fl w40">价格</div>
      </div>
      <div class="clesrfix c_333 mgt10 h100 border_b">
        <div class="fl w60">
          <div class="img"><img :src="info.courseImg" alt=""></div>
          <div class="name">{{info.courseName}}</div>
        </div>
        <div class="fl w40 c_red center">{{money}}</div>
        <!-- <div class="fl w40 c_red center" v-if="info.discountType == 1">
          ￥{{isVip ? (info.fabPrice * info.discountPrice).toFixed(2) : (info.orgPrice * info.discountPrice).toFixed(2)}}
        </div>
        <div class="fl w40 c_red center" v-if="info.discountType == 2">
          ￥{{isVip ? (info.fabPrice - info.discountPrice).toFixed(2) : (info.orgPrice - info.discountPrice).toFixed(2)}}
        </div> -->
      </div>
      <div class="pd20 border_b">
        <span>备注:</span>
        <input class="remark" v-model="order.remark" type="text">
      </div>
      <div class="pay_type">
        <input type="radio" id="payType2" name="payType" value="2" v-model="order.payType">
        <label for="payType2" class="pay pay_ali"></label>
        <input type="radio" id="payType1" name="payType" value="1" v-model="order.payType">
        <label for="payType1" class="pay pay_weixin"></label>
      </div>
      <div class="modal_foot">
        <button class="solid_btn" @click="submit" :disabled="btntext === '正在提交...'">{{btntext}}</button>
      </div>
    </div>
    <div class="paymodal codemodal" v-else-if="payStep === 1">
      <div class="modal_head">
        <span class="fl">收银台</span>
        <a href="javascript:" @click="close()" class="close iconfont">&#xe616;</a>
      </div>
      <div class="modal_body">
        <div class="tip" v-if="orderInfo.payType === 2">支付宝支付 {{orderInfo.price.toFixed(2)}}元</div>
        <div class="tip" v-else>微信支付 {{orderInfo.price.toFixed(2)}}元</div>
        <div class="code" id="qrcode">
          <canvas id="canvas"></canvas>
        </div>
        <p class="tip2" v-if="orderInfo.payType === 2">请使用支付宝扫描<br> 二维码以完成订单</p>
        <p class="tip2" v-else>请使用微信扫描<br> 二维码以完成订单</p>
        <div class="tip_panel">
          提示: <br>
          支付成功前请勿手动关闭页面 <br>
          二维码两小时内有效,请及时扫码支付
        </div>
      </div>
    </div>
    <div class="paymodal payrun" v-else-if="payStep === 2">
      <div class="modal_head">
        <span class="fl">收银台</span>
        <a href="javascript:" @click="close()" class="close iconfont">&#xe616;</a>
      </div>
      <div class="modal_body">
        <div class="icon iconfont c_green">&#xe69f;</div>
        <div class="tip">支付成功</div>
        <div class="center">
          <router-link class="solid_btn" v-if="info.courseCategory == 1" :to="{name: 'courselDetail', params: {id: info.id}}">立即学习</router-link>
          <router-link class="solid_btn" v-else-if="info.courseCategory == 2" :to="{name: 'liveDetail', params: {id: info.id}}">立即学习</router-link>
          <router-link class="solid_btn" v-else-if="info.courseCategory == 3" :to="{name: 'liveAndBunch', params: {id: info.id}}">立即学习</router-link>
          <button class="solid_btn" v-else @click="reload">确定</button>
        </div>
      </div>
    </div>
    <div class="paymodal payrun" v-else-if="payStep === 3">
      <div class="modal_head">
        <span class="fl">收银台</span>
        <a href="javascript:" @click="close()" class="close iconfont">&#xe616;</a>
      </div>
      <div class="modal_body">
        <div class="icon iconfont c_red">&#xe68c;</div>
        <div class="tip">支付失败</div>
        <div class="center">
          <button class="solid_btn" @click="{payStep = 0}">重新购买</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {avtivityPay} from '~/api/activity.js'
  import {orderInfo} from '~/api/course.js'
  import QRCode from 'qrcode'
  import {mapState, mapMutations} from 'vuex'
  export default {
    props: {
      info: {
        type: [Object, Array],
        default: null
      }
    },
    data () {
      return {
        money: '',
        isVip: false,
        order: {
          payType: 1,
          channelType: 1,
          remark: '',
          userNo: ''
        },
        checkPay: false,
        btntext: '下一步',
        payStep: 0,
        orderInfo: null
      }
    },
    computed: {
      ...mapState(['userInfo', 'tokenInfo', 'clientData', 'webInfo'])
    },
    methods: {
      ...mapMutations(['RECORD_TEMPORARYURL', 'SIGN_OUT', 'RECORD_USERINFO']),
      reload () {
        window.location.reload();
      },
      close (event) {
        this.checkPay = true;
        this.$emit('hidefun', event);
      },
      qrcode (url) {
        QRCode.toCanvas(document.getElementById('canvas'), url, {
          width: 180,
          height: 180
        }, function (error) {
          if (error) console.error(error)
          console.log('success!')
        })
      },
      submit () {
        let that = this;
        that.btntext = '正在提交...';
        that.order.actId = that.info.actId
        that.order.courseNo = that.info.courseNo
        that.order.userNo = that.userInfo.userNo
        that.order.courseCategory = that.info.courseCategory
        avtivityPay(that.order).then(res => {
          that.btntext = '下一步';
          if (res.code === 200) {
            that.payStep = 1;
            that.orderInfo = res.data;
            this.ocl = setTimeout(function () {
              that.qrcode(res.data.payMessage);
            }, 100);
            that.getOrderInfo(res.data.orderNo)
          } else {
            if (res.code >= 300 && res.code < 400) {
              this.$msgBox({
                content: res.msg,
                isShowCancelBtn: false
              }).then(() => {
                this.RECORD_TEMPORARYURL()
                this.SIGN_OUT();
                this.$router.push({name: 'login'})
              }).catch(() => {})
            } else {
              this.$msgBox({
                content: res.msg,
                isShowCancelBtn: false
              }).then(() => {
                if (res.msg == '已经购买过本课程，无需重复购买') {
                  this.close()
                }
              }).catch(() => {})
            }
          }
        }).catch(() => {
          this.$msgBox({
            content: '提交失败,请重试',
            isShowCancelBtn: false
          })
          that.btntext = '重新提交';
        })
      },
      getOrderInfo (no) {
        let that = this;
        if (this.checkPay) {
          return false;
        }
        orderInfo({orderNo: no}).then(res => {
          if (res.data.orderStatus === 1) {
            setTimeout(function () {
              that.getOrderInfo(no);
            }, 1000);
          } else if (res.data.orderStatus === 2) {
            that.payStep = 2;
          } else {
            that.payStep = 3;
          }
        })
      }
    },
    mounted () {
      if (this.webInfo) {
        if (this.webInfo.isEnableVip && this.userInfo.isVip) {
          if (this.userInfo.expireTime) {
            if ((new Date(this.userInfo.expireTime)).getTime() > (new Date().getTime())) {
              this.isVip = true
            }
          }
        }
      }
      if (this.info.discountType === 1) {
        this.money = this.isVip ? (this.info.fabPrice * this.info.discountPrice).toFixed(2) : (this.info.orgPrice * this.info.discountPrice).toFixed(2)
      } else if (this.info.discountType === 2) {
        this.money = this.isVip ? (this.info.fabPrice - this.info.discountPrice).toFixed(2) : (this.info.orgPrice - this.info.discountPrice).toFixed(2)
      }
      if (this.money <= 0) {
        this.$msgBox({
          content: '活动异常，请联系客服',
          isShowCancelBtn: false
        }).then(() => {
          this.close()
        }).catch(() => {
          this.close()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
a:hover {
  text-decoration: none;
}
.model {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
.pay_box {
  overflow: hidden;
  width: 470px;
  border-radius: 6px;
  background: #fff;
  // padding: 20px;
  position: fixed;
  z-index: 2;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  .img{
    display: inline-block;
    width: 120px;
    padding: 0;
  }
  .name{
    width: 110px;
    float: right;
    vertical-align: top;
  }
  .box_title {
    height: 36px;
    line-height: 36px;
    padding: 0 20px;
    border-bottom: 1px solid rgb(230, 230, 230);
    color: #333;
  }
  .remark {
    width: 90%;
    font-size: 14px;
    height: 20px;
    position: relative;
    top: -2px;
    border: none;
    float: right;
  }
  .h36 {
    height: 36px;
    line-height: 36px;
  }
  .h100 {
    height: 100px;
  }
  .w60 {
    width: 242px;
    padding: 0 20px;
  }
  .w40 {
    width: 148px;
    padding: 0 20px;
  }
  .pd20 {
    padding: 20px;
  }
  .b_245 {
    background: rgb(245, 245, 245);
  }
}
.close {
  cursor: pointer;
  &:hover {
    color: #d51423;
  }
}
.modal_foot{
  border-top: 1px solid rgb(245, 245, 245);
  padding: 20px;
  text-align: center;
}
.pay_type{
  padding: 20px;
  overflow: hidden;
  input{
    display: none;
    &:checked + .pay{
      border-color: #ec7f00;
    }
  }
}
.pay{
  width: 210px;
  height: 50px;
  border: 1px solid #fff;
  float: left;
  background-repeat: no-repeat;
  background-position: center center;
  &.pay_ali {
    background-image: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABGAAD/4QMsaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MCA3OS4xNjA0NTEsIDIwMTcvMDUvMDYtMDE6MDg6MjEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMjlEQTRGOTRBODgxMUU4OEJBREIyOUE3Mjg5MjBCRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozMjlEQTRGQTRBODgxMUU4OEJBREIyOUE3Mjg5MjBCRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjMyOURBNEY3NEE4ODExRTg4QkFEQjI5QTcyODkyMEJEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjMyOURBNEY4NEE4ODExRTg4QkFEQjI5QTcyODkyMEJEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABAMDAwMDBAMDBAYEAwQGBwUE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);
  }
  &.pay_weixin {
    background-image: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABGAAD/4QMsaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MCA3OS4xNjA0NTEsIDIwMTcvMDUvMDYtMDE6MDg6MjEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMjlEQTRGRDRBODgxMUU4OEJBREIyOUE3Mjg5MjBCRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozMjlEQTRGRTRBODgxMUU4OEJBREIyOUE3Mjg5MjBCRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjMyOURBNEZCNEE4ODExRTg4QkFEQjI5QTcyODkyMEJEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjMyOURBNEZDNEE4ODExRTg4QkFEQjI5QTcyODkyMEJEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABAMDAwMDBAMDBAYEAwQGBwUE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);
  }
}
.payrun{
  .modal_body{
    padding: 30px;
    height: 180px;
  }
  .icon{
    font-size: 80px;
    width: 80px;
    margin: 0 auto;
    text-align: center;
  }
  .tip{
    font-size: 16px;
    text-align: center;
    padding-bottom: 20px;
  }
  .c_green{
    color: #05d005;
  }
}
.codemodal{
  .tip{
    margin: 30px auto 0;
    text-align: center;
    font-size: 16px;
  }
  .code{
    width: 180px;
    height: 180px;
    border: 1px solid #ddd;
    margin: 20px auto;
  }
  .tip2{
    margin: 0 auto;
    width: 130px;
    padding: 13px 0 13px 70px;
    height: 42px;
    line-height: 20px;
    font-size: 14px;
    color: #fff;
    background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABGAAD/4QMsaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MCA3OS4xNjA0NTEsIDIwMTcvMDUvMDYtMDE6MDg6MjEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBQUJFOEQ1MjRBQUExMUU4OEJBREIyOUE3Mjg5MjBCRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBQUJFOEQ1MzRBQUExMUU4OEJBREIyOUE3Mjg5MjBCRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjMyOURBNEZGNEE4ODExRTg4QkFEQjI5QTcyODkyMEJEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjMyOURBNTAwNEE4ODExRTg4QkFEQjI5QTcyODkyMEJEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABAMDAwMDBAMDBAYEAwQGBwUEBAUHCAYGBwYGCAoICQkJCQgKCgwMDAwMCgwMDQ0MDBERERERFBQUFBQUFBQUFAEEBQUIBwgPCgoPFA4ODhQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAKQApAwERAAIRAQMRAf/EAIAAAAICAwEAAAAAAAAAAAAAAAYHAwQBAggFAQACAwEAAAAAAAAAAAAAAAABBAADBQIQAAEDAwMDAwQABwAAAAAAAAIBAwQRBQYAEgchMRNRIjJBUiMUYXGBkUIzFREAAgMAAQMEAwEAAAAAAAAAAQIAEQMxIUESYSIyE/BRcQT/2gAMAwEAAhEDEQA/AGXaIHE+IcNYpmWW4iN6nXUzjPOtLR0nN76oRbjFKILdOmtpjq+rKrVUzQEXMMRcXnIGY8S32wJBwrDXLDefO24s4yFU8IoW8Ojhd6p9NM456q1s1iUaOhHtFGK3cPqmnIvD/jXJuOseG5JnuMHkRSFZWAoKKeFAQ/JXcYfKo/20tsmjV4GpdkyD5C46cODhLki25MFjwUbbLs9uclo9IWvuID2qOxwuqKNeukNPuzItrsxtPrcGl4nJ+8/uXWzM2Gl05Cv13wq0YFLGOlksrqvwzACR9TXyfM1JUVPyl/imqFxUOX7mWnQlQvYStFjWyy2xm7XRlJtzmop223HVGQaRaed+lFJFVFQAr1pVenckljQ4gAAFmYTMco8ZEzIRqGCoJMsx2QjCpV2iooG3rRaJqfWsnm0maG35Uw82EduDk7Qk6ykcUbjzRBKkHjToDqIiqO32l2pXQ6p/Iejf2b4VyFfsDC7hZBjkN6jfpzP2QJyjXuT2bSGi+5fXU1xXSr7SJoUuu8EPCPqurpVJC+K09NSGEOYbEv8A46qkQI8MGVFK0Z/Xb+KVRPXVWfxnb8xiWO3ccFx7cSOY8UQnmCuEl1lkJjckAl+FAbSX6UpRFrVf47VWbT7B+fr0l6hPCLG1qDOSwFtDjroDLY/WcdAWnV949wAzRFr6EunG+JuLjnpK16Bhu83II1P1hlPizTt40dJBp/TRXgQNzKWuoIb3rjabZeO7FyG7Padh315Y7UEQJHW1Ty9SJVov+pe3rpddg2hSuJa2dIG/c81hIeS22PDdfCLkUAEZim8SAzLjJ8G1NeguBWg7uhD07p17Nqb7QfIesqrj2Wstu25LZNRh4wcdbBkybI2kJAJSFFFaIZUWv10fNebEHi0vRYzOIgdxuLglkqIo263NkhrGMkp531GqCo19gd69VpTryT59BxCB49TzL3HnG03kNu+uRJ7UL/hRP3nvMBOK6NDXaO1Uovs+uudthnXTmHPMvfpAPzJ9umZTOprbYcW5B4Mw7GJmYW2wzrc65KeGS6ybie+QCATZPNqNUOvXWOztnszBSbmiFV8wLqLDkLibH8LsCXm2Zvb8hkq+2x/z4ni8u1xCVT9j7i0Gn26bx/0M7UVIi+mQUWDcWgTpzbfhblPCz28YuGg0/ki003QlFmHHGnHdnzwbkV1yuFjKwVZRpJuz8/m31Ud7zXx29e/fS++xzql8pblmH5NR7YBhmH8X2zLJCZ7abw5drY5GbZbdYZISAHFSn53NyrupSms7XR9SvtIoxzNFQH3A9JyBtX0XW3MySl8l1IZkO+pJJNCSRn9NGSa6kkm0JJ//2Q==) no-repeat 20px center #445f85;
  }
  .tip_panel{
    margin-top: 20px;
    padding: 20px;
    line-height: 20px;
    border-top: 1px solid #f1f1f1;
  }
}
.paymodal{
  position: fixed;
  left: 50%;
  top: 10%;
  z-index: 999;
  width: 480px;
  margin-left: -240px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  .modal_head{
    line-height: 46px;
    background-color: #f9f9f9;
    text-align: right;
    padding: 0 20px;
    .close{
      font-size: 14px;
    }
  }
  .modal_foot{
    border-top: 1px solid #e7e7eb;
    padding: 20px;
    text-align: center;
  }
  .table{
    width: 100%;
  }
  th{
    line-height: 36px;
    background-color: #f8f8f8;
  }
  td{
    vertical-align: middle;
    padding: 20px;
  }
  .name{
    width: 140px;
    padding-left: 12px;
    font-size: 16px;
  }
  .img{
    display: inline-block;
    width: 120px;
    padding: 0;
  }
  .name{
    display: inline-block;
    vertical-align: top;
  }
  .tabs {
    height: 48px;
    .tab{
      float: left;
      line-height: 46px;
      text-align: center;
      font-size: 16px;
      width: 50%;
    }
    span{
      cursor: default;
      display: inline-block;
      line-height: 46px;
    }
    .on{
      color: #ee7e00;
      span{
        border-bottom: 2px solid #ee7e00;
      }
    }
  }
}
</style>
