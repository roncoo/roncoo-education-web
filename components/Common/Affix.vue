<template>
  <div class="affix">
    <el-affix class="affix-info">
      <el-popover placement="left">
        <template #reference>
          <img src="~/assets/svg/gzh.svg" width="30" />
        </template>
        <template #default>
          <img style="width: 126px" src="~/assets/image/gzh.jpg" />
          <div style="font-size: 10px; text-align: center">扫码关注微信公众号</div>
        </template>
      </el-popover>
    </el-affix>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
  .affix {
    position: fixed;
    right: 5px;
    top: 50vh;
    .affix-info {
      background-color: #fff;
      border-radius: 8px 0 0 8px;
      padding: 10px;
    }
  }
</style>
