<template>
  <div class="affix">
    <el-affix class="affix-info">
      <el-popover placement="left">
        <template #reference>
          <div class="icon">
            <img src="~/assets/svg/phone.svg" width="30" alt="" />
            <div>商业版</div>
          </div>
        </template>
        <template #default>
          <img style="width: 126px" src="~/assets/image/phone.png" alt="" />
          <div style="font-size: 10px; text-align: center">扫码咨询商业版</div>
        </template>
      </el-popover>
    </el-affix>
    <el-affix class="affix-info">
      <el-popover placement="left">
        <template #reference>
          <div class="icon">
            <img src="~/assets/svg/gzh.svg" width="30" alt="" />
            <div>公众号</div>
          </div>
        </template>
        <template #default>
          <img style="width: 126px" src="~/assets/image/gzh.jpg" alt="" />
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
    top: 40vh;
    .affix-info {
      background-color: #fff;
      padding: 10px;
    }
  }
  .icon {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
