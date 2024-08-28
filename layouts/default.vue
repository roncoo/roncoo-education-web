<template>
  <common-header />
  <!--  <common-affix />-->
  <el-main>
    <slot />
    <common-footer />
  </el-main>
</template>
<script setup></script>
<style lang="scss" scoped>
  .el-main {
    padding: 0;
    overflow: auto;
    margin: 70px auto 0;
    height: calc(100vh - 70px);
  }
</style>
