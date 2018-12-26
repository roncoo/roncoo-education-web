<template>
  <div class="card_info">
    <div class="w240">
      <span class="font_b">账号信息</span>
      <button class="fr default_btn c_999">修改</button>
    </div>
    <div>
      <span>提现卡号：</span>
      <span class="c_999">未绑定，请点击</span>
      <span class="default_btn a_btn c_blue">进入绑定</span>
    </div>
  </div>
</template>
<script>
  export default {}
</script>
<style lang="scss" scoped>
  .card_info {
    background: #fff;
    border-radius: 6px;
    height: 166px;
    padding: 20px;
    font-size: 14px;
  }
  .w240 {
    width: 240px;
  }
  .default_btn {
    background: #fff;
    border: none;
    outline: none;
    cursor: pointer;
  }
  .a_btn {
    &:hover {
      text-decoration: underline;
    }
  }
</style>