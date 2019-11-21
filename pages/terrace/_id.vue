<template>
  <div>
    <y-header :active="'index'"></y-header>
    <div class="person_body clearfix">
      <y-side :showSide="'wm'"></y-side>
      <div class="person_content">
        <div class="person_title">
          {{artTitle}}
        </div>
        <div class="person_info">
          <p class="top_text" v-html="artDesc"></p>
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
import {aboutInfo} from '~/api/main.js'
export default {
  head () {
      return {
        title: this.artTitle,
        meta: [
            {
                name: 'keywords',
                content: this.webInfo.websiteKeyword
            },
            {
                name: 'description',
                content: this.webInfo.websiteDesc
            }
        ]
      }
  },
  data () {
    return {
      webInfo: this.$store.state.webInfo,
      navId: '',
      artTitle: '',
      artDesc: ''
    }
  },
  validate ({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id)
  },
  async asyncData(context) {
    let {data} = await aboutInfo({navId: context.params.id});
    if (data.code == 200) {
      return {
        artTitle: data.data.artTitle,
        artDesc: data.data.artDesc
      }
    }else{
      return {
        artTitle: '',
        artDesc: ''
      }
    }
  },
  mounted () {
    if (this.artTitle == '') {
      this.$msgBox({
        content: '获取信息失败',
        isShowCancelBtn: false
      })
    }
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
</style>
