<template>
  <div>
    <y-header :active="'zmzx'"></y-header>
    <div class="person_body clearfix">
      <y-side :type="'jszm'" :showSide="'zm'"></y-side>
      <div class="person_content">
        <div class="person_title">
          <!-- 讲师招募 -->
          {{webInfo.recruitTitle}}
        </div>
        <div class="person_info">
          <div class="clearfix" v-html="webInfo.recruitInfo"></div>
          <div>
            <a href="javascript:" class="apply_btn" @click="goApply">申请成为讲师</a>
          </div>
        </div>
      </div>
    </div>
    <y-footer></y-footer>
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YFooter from '~/components/common/Footer'
import YSide from '~/components/TerraceSide'
export default {
  head () {
      return {
        title: this.$store.state.clientData.name + '-讲师招募',
        meta: [
            {
                hid: 'keywords',
                name: 'keywords',
                content: this.$store.state.webInfo.websiteKeyword
            },
            {
                hid: 'description',
                name: 'description',
                content: this.$store.state.webInfo.websiteDesc
            }
        ]
      }
  },
  data () {
    return {
      webInfo: this.$store.state.webInfo
    }
  },
  methods: {
    goApply () {
      this.$router.push({name: 'apply'})
    }
  },
  mounted () {
    this.webInfo = this.$store.state.webInfo
  },
  components: {
    YHeader,
    YFooter,
    YSide
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
    .person_title {
      font-size: 14px;
      font-weight: 700;
      color: #333;
      text-align: center;
      line-height: 100px;
    }
  }
  .person_info {
    padding: 0px 50px 50px;
    min-height: 400px;
    font-size: 14px;
    color: #333;
    line-height: 28px;
  }
  .recruit_info {
    margin-top: 40px;
    .recruit_title {
      .cols {
        display: inline-block;
        width: 4px;
        height: 14px;
        background: rgba(51, 51, 51, 1);
        position: relative;
        top: 2px;
        margin-right: 4px;
      }
      font-weight: 700;
    }
    .msg_rows {
      margin-top: 10px;
      padding-left: 10px;
    }
  }
  .apply_btn {
    display: inline-block;
    width: 160px;
    line-height: 36px;
    color: #fff;
    background: rgba(213, 20, 35, 1);
    text-align: center;
    border-radius: 6px;
    position: relative;
    left: 50%;
    margin-left: -80px;
    margin-top: 10px;
    &:hover {
      text-decoration: none;
    }
  }
</style>
