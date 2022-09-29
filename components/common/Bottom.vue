<template>
  <div class="i_bottom">
    <div v-if="service.websiteCopyright" class="copyright">
      <span v-html="service.websiteCopyright" />
    </div>
    <div class="icp_num">
      <a href="http://www.doityun.com/" target="_blank" class="lingke_link">IT云提供计算服务</a>
      <span v-if="service.websiteIcp">&nbsp;|&nbsp;
        <a href="http://www.miitbeian.gov.cn/" target="_blank" class="lingke_link">{{ service.websiteIcp }}</a>
      </span>
      <span v-if="service.websitePrn">&nbsp;|&nbsp;
        <a :href="'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=' + service.websitePrnNo" target="_blank" class="lingke_link"><img src="~/assets/image/prn_icon.png" class="prn_icon" alt="">&nbsp;{{ service.websitePrn }}</a>
      </span>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Bottom',
  data() {
    return {
      service: this.$store.state.websiteInfo || {}
    }
  },
  mounted() {
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.i_bottom {
  background: rgb(51, 51, 51);
  padding: 10px 0;
}

.copyright {
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #ccc;

  a {
    color: #ccc;
  }
}

.icp_num {
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
  width: 16px;
  height: 16px;
  position: relative;
}

</style>
