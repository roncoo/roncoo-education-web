<template>
  <div class="card_info">
    <div class="w240">
      <span class="font_b c_333">账号信息</span>
      <button class="fr default_btn c_999" @click="showBind">修改</button>
    </div>
    <div class="mgt10">
      <span class="c_333">提现卡号：</span>
      <span>{{card.bankCardNo ? card.bankCardNo : '未绑定，请点击'}}</span>
      <span class="default_btn a_btn c_blue" v-if="!card.bankCardNo" @click="showBind">进入绑定></span>
    </div>
    <div class="mgt10">
      <span class="c_333">开户行：</span>
      <span>{{card.bankName ? card.bankName : '未绑定，请点击'}}</span>
      <span class="default_btn a_btn c_blue" v-if="!card.bankName" @click="showBind">进入绑定></span>
    </div>
    <div class="mgt10">
      <span class="c_333">开户名：</span>
      <span>{{card.bankUserName ? card.bankUserName : '未绑定，请点击'}}</span>
      <span class="default_btn a_btn c_blue" v-if="!card.bankUserName" @click="showBind">进入绑定></span>
    </div>
  </div>
</template>
<script>
  import {cardInfo} from '~/api/account/user.js'
  export default {
    data () {
      return {
        card: ''
      }
    },
    methods: {
      showBind () {
        this.$emit('showBind')
      },
      // 获取银行卡信息
      getCardInfo () {
        cardInfo({
          lecturerUserNo: this.$store.state.userInfo.userNo
        }).then(res => {
          let result = res.data
          console.log(result)
          console.log('cardinfo=======' + this.$store.state.userInfo.userNo)
          if (result.code === 200) {
            this.card = result.data || {}
          } else if (result.code > 300 && result.code <400) {
            this.$msgBox({
              content: '登录超时，请重新登录',
              isShowCancelBtn: false
            }).then(() => {
              this.$store.dispatch('REDIRECT_LOGIN')
            }).catch(() => {
              this.$store.dispatch('REDIRECT_LOGIN')
            })
          } else {
            this.$msgBox({
              content: result.msg,
              isShowCancelBtn: false
            }).catch(() => {})
          }
        })
      }
    },
    mounted () {
      this.getCardInfo()
    }
  }
</script>
<style lang="scss" scoped>
  .card_info {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    font-size: 14px;
  }
  .w240 {
    width: 240px;
  }
  .default_btn {
    background: #fff;
    border: none;
    outline: none;
    cursor: pointer;
    display: inline-block;
  }
  .a_btn {
    &:hover {
      text-decoration: underline;
    }
  }
</style>