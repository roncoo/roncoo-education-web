<template>
  <el-footer class="i_bottom">
    <div v-if="props.info.websiteCopyright" class="copyright">
      <span v-html="props.info.websiteCopyright" />
    </div>
    <div class="icp_num">
      <a href="http://www.doityun.com/" target="_blank" class="lingke_link">IT云提供计算服务</a>
      <span v-if="props.info.websiteIcp"
        >&nbsp;|&nbsp;
        <a href="http://www.miitbeian.gov.cn/" target="_blank" class="lingke_link">{{ props.info.websiteIcp }}</a>
      </span>
      <span v-if="props.info.websitePrn"
        >&nbsp;|&nbsp;
        <a :href="'http://www.beian.gov.cn/portal/registerSystemprops.info?recordcode=' + props.info.websitePrnNo" target="_blank" class="lingke_link"
          ><img src="../../assets/image/common_prn.png" class="prn_icon" alt="" />&nbsp;{{ props.info.websitePrn }}</a
        >
      </span>
    </div>
  </el-footer>
</template>
<script setup>
  const props = defineProps({
    info: {
      type: Object,
      default: null
    }
  })
</script>
<style lang="scss" scoped>
  .i_bottom {
    background: rgb(51, 51, 51);
  }

  .copyright {
    height: 20px;
    line-height: 20px;
    text-align: center;
    padding-top: 10px;
    color: #ccc;
    a {
      color: #ccc;
    }
  }

  .icp_num {
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #ccc;
    .lingke_link {
      color: #ccc;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .prn_icon {
    width: 12px;
    height: 12px;
    position: relative;
  }
</style>
