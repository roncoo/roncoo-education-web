<template>
  <common-header :info="info" />
  <el-main>
    <slot />
  </el-main>
  <common-footer :info="info" />
</template>
<script setup>
  import { indexApi } from '~/api/index.js'

  // 网站信息
  const info = ref({})
  onMounted(() => {
    indexApi.websiteInfo().then((res) => {
      info.value = res
    })
  })
</script>
<style lang="scss" scoped>
  .el-main {
    margin: 70px auto 0;
    padding: 0;
  }
</style>
