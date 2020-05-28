<template>
  <div class="account_pages">
    <div class="person_body clearfix">
      <y-side :type="sideType" />
      <div class="person_content">
        <div v-if="$route.query.type === '3'" class="step_panel">
          <div class="step on step50">
            填写组合课程信息
          </div>
          <div class="step on step50">
            提交审核
          </div>
        </div>
        <div v-else-if="$route.query.type === '4'" class="step_panel">
          <div class="step on">
            填写资源信息
          </div>
          <div class="step on">
            上传资源附件
          </div>
          <div class="step on">
            提交审核
          </div>
        </div>
        <div v-else-if="$route.query.type === '5'" class="step_panel">
          <div class="step on">
            填写信息
          </div>
          <div class="step on">
            上传视频内容
          </div>
          <div class="step on">
            提交审核
          </div>
        </div>
        <div v-else class="step_panel">
          <div class="step on">
            填写课程信息
          </div>
          <div class="step on">
            上传课程内容
          </div>
          <div class="step on">
            提交审核
          </div>
        </div>
        <div class="person_info">
          <div class="success_msg">
            <img src="../../../assets/image/success.svg" alt="">
            <p>提交成功</p>
            <span>审核结果将在3个工作日内完成，请留意。</span>
          </div>
          <div class="form_group">
            <div class="label">
              &nbsp;
            </div>
            <div class="form_ctl">
              <button @click="goBack" href="javascript:" class="submit_btn">
                查看
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import YSide from '~/components/account/Side'
  export default {
    components: {
      YSide
    },
    head() {
      return {
        title: this.$store.state.clientData.name + ' - 点播管理'
      }
    },
    data() {
      return {
        sideType: 'kcgl'
      }
    },
    mounted() {
      if (this.$route.query.type === '3') {
        this.sideType = 'zhtc'
      } else if (this.$route.query.type === '2') {
        this.sideType = 'zbgl'
      } else if (this.$route.query.type === '5') {
        this.sideType = 'kyxm'
      } else if (this.$route.query.t === '5') {
        this.sideType = 'tkgl'
      } else if (this.$route.query.t === '4') {
        this.sideType = 'zygl'
      }
    },
    methods: {
      goBack() {
        if (this.$route.query.type === '3') {
          this.$router.push({ name: 'courseGroup' })
        } else if (this.$route.query.type === '2') {
          this.$router.push({ name: 'account-live' })
        } else if (this.$route.query.type === '4') {
          this.$router.push({ name: 'resource' })
        } else if (this.$route.query.type === '5') {
          this.$router.push({ name: 'open' })
        } else if (this.$route.query.t === '5') {
          this.$router.push({ name: 'account-library' })
        } else if (this.$route.query.t === '4') {
          this.$router.push({ name: 'account-resource' })
        } else {
          this.$router.push({ name: 'account-teacher-course' })
        }
      }
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
  .person_info {
    padding: 50px 0;
    min-height: 400px;
  }
  .form_group{
    margin-bottom: 20px;
    font-size: 14px;
    .label{
      text-align: right;
      float: left;
      display: block;
      width: 110px;
      line-height: 36px;
      color: #333;
    }
    .form_ctl{
      margin-left: 12px;
      float: left;
      width: 700px;
      position: relative;
      input {
        width: 310px;
        height: 46px;
        padding-left: 10px;
        border-radius: 6px;
        font-size: 14px;
        margin-top: -5px;
        &.radio_box {
          width: 14px;
          height: 14px;
        }
        &.pirce {
          width: 174px;
          margin-right: 10px;
        }
      }
    }
    .text{
      color: #333;
      line-height: 36px;
    }
    &:after{
      content: '';
      display: block;
      clear: both;
    }
  }
  .step_panel{
    overflow: hidden;
    background-color: #eee;
    .step{
      float: left;
      width: 33.33333%;
      text-align: center;
      height: 60px;
      line-height: 60px;
      color: #333;
      font-size: 14px;
      position: relative;
      &.step50 {
        width: 50%;
      }
      &:after{
        content: "";
        display: block;
        position: absolute;
        right: -14px;
        top: -5px;
        z-index: 1;
        width: 70px;
        height: 70px;
        box-shadow: 1px 1px 0 #fff;
        transform:rotate(-45deg);
      }
      &.on{
        color: #fff;
        background-color: rgba(213, 20, 35, 1);
        &:after{
          background-color: rgba(213, 20, 35, 1);
        }
      }
    }
  }
  .submit_btn{
    height: 46px;
    border: none;
    background-color: rgb(213, 20, 35);
    width: 320px;
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    left: 50%;
    margin-left: -160px;
  }
  .success_msg {
    width: 350px;
    margin: 0 310px 30px;
    position: relative;
    img {
      width: 55px;
      height: 55px;
    }
    p {
      font-size: 20px;
      color: #333;
      position: absolute;
      left: 75px;
      top: 0;
    }
    span {
      position: absolute;
      font-size: 14px;
      color: #999;
      left: 75px;
      top: 30px;
    }
  }
</style>
