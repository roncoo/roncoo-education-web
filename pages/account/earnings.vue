<template>
  <div>
    <y-header />
    <div class="person_body clearfix">
      <y-side :type="'syqk'" />
      <div class="person_content">
        <y-card-info />
      </div>
    </div>
    <y-footer />
  </div>
</template>
<script>
  import YHeader from '~/components/common/Header'
  import YFooter from '~/components/common/Footer'
  import YSide from '~/components/account/Side'
  import YCardInfo from '~/components/account/earnings/CardInfo'
  export default {
    components: {
      YHeader,
      YFooter,
      YSide,
      YCardInfo
    }
  }
</script>
<style lang="scss" scoped>
  .person_body {
    width: 1200px;
    margin: 30px auto 0;
  }
  .person_content {
    width: 1012px;
    float: right;
    border-radius: 6px;
  }
</style>