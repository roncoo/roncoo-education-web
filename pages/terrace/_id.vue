<template>
  <div>
    <y-header :active="'index'" />
    <div class="person_body clearfix">
      <y-side :show-side="'wm'" />
      <div class="person_content">
        <div class="person_title">
          {{ artTitle }}
        </div>
        <div class="person_info">
          <p class="top_text" v-html="artDesc" />
        </div>
      </div>
    </div>
    <y-footer />
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YFooter from '~/components/common/Footer'
import YSide from '~/components/TerraceSide'
// import { aboutInfo } from '~/api/main.js'
export default {
  components: {
    YHeader,
    YFooter,
    YSide
  },
  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id)
  },
  async asyncData(context) {
    return {
      artTitle: '',
      artDesc: ''
    }
  },
  data() {
    return {
      websiteInfo: this.$store.state.websiteInfo,
      navId: '',
      artTitle: '',
      artDesc: ''
    }
  },
  head() {
    return {
      title: this.artTitle,
      meta: [
        {
          name: 'keywords',
          content: this.websiteInfo.websiteKeyword
        },
        {
          name: 'description',
          content: this.websiteInfo.websiteDesc
        }
      ]
    }
  },
  mounted() {
    if (this.artTitle === '') {
      this.$msgBox({
        content: '获取信息失败',
        isShowCancelBtn: false
      })
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
</style>
