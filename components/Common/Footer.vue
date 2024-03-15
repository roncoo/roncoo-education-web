<template>
  <el-footer class="i_bottom">
    <div v-if="info.websiteCopyright" class="copyright">
      <span v-html="info.websiteCopyright" />
    </div>
    <div class="icp_num">
      <a href="http://www.doityun.com/" target="_blank" class="lingke_link">IT云提供计算服务</a>
      <span v-if="info.websiteIcp"
        >&nbsp;|&nbsp;
        <a href="http://www.miitbeian.gov.cn/" target="_blank" class="lingke_link">{{ info.websiteIcp }}</a>
      </span>
      <span v-if="info.websitePrn"
        >&nbsp;|&nbsp;
        <a :href="'http://www.beian.gov.cn/portal/registerSystemprops.info?recordcode=' + info.websitePrnNo" target="_blank" class="lingke_link"
          ><img src="../../assets/image/common_prn.png" class="prn_icon" alt="" />&nbsp;{{ info.websitePrn }}</a
        >
      </span>
    </div>
  </el-footer>
</template>
<script setup>
  import { indexApi } from '~/api/index.js'
  import { getStorage, setStorage } from '~/utils/storage.js'

  // 网站信息
  const info = ref({})
  onMounted(() => {
    info.value = getStorage('WebsiteInfo')
    if (!info.value) {
      indexApi.websiteInfo().then((res) => {
        setStorage('WebsiteInfo', res, 60)
        info.value = res
      })
    }
  })
</script>
<style lang="scss" scoped>
  .i_bottom {
    background: rgb(51, 51, 51);
    z-index: 999;
  }

  .copyright {
    height: 20px;
    line-height: 20px;
    text-align: center;
    padding-top: 5px;
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
