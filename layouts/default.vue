<template>
  <common-header />
  <el-main>
    <slot />
    <common-footer />
  </el-main>
</template>
<style lang="scss" scoped>
  .el-main {
    padding: 0;
    overflow: auto;
    margin: 70px auto 0;
    height: calc(100vh - 70px);
  }
</style>
