<template>
  <common-header />
  <el-main>
    <slot />
  </el-main>
  <common-link />
  <common-footer />
</template>
<script setup>
  import CommonFooter from '~/components/Common/CommonFooter.vue'
  import CommonHeader from '~/components/Common/CommonHeader.vue'
  import CommonLink from '~/components/Common/CommonLink.vue'
</script>
<style lang="scss" scoped>
  .el-main {
    width: 1200px;
    margin: 70px auto 0;
    padding: 0;
  }
</style>
