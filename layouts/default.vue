<template>
  <common-header />
  <el-main>
    <slot />
  </el-main>
  <common-link />
  <common-footer />
</template>
<script setup></script>
<style lang="scss" scoped>
  .el-main {
    width: 1200px;
    margin: 70px auto 0;
    padding: 0;
  }
</style>
