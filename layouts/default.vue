<template>
  <common-header />
  <el-main>
    <slot />
  </el-main>
  <common-footer />
</template>
<script setup></script>
<style lang="scss" scoped>
  .el-main {
    margin: 70px auto 0;
    padding: 0;
    overflow: auto;
    height: calc(100vh - 130px);
  }
</style>
