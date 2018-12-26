<template>
  <div class="earnings">
    <y-header />
    <div class="person_body clearfix">
      <y-side :type="'syqk'" />
      <div class="main_box">
        <y-card-info @showBind="showBind" />
        <y-earning-table v-show="hideBind" />
        <y-bind-card @closeBind="closeBind" v-show="!hideBind" />
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
  import YEarningTable from '~/components/account/earnings/EarningTable'
  import YBindCard from '~/components/account/earnings/BindCard'
  export default {
    components: {
      YHeader,
      YFooter,
      YSide,
      YCardInfo,
      YEarningTable,
      YBindCard
    },
    data () {
      return {
        hideBind: true
      }
    },
    methods: {
      showBind () {
        this.hideBind = false
      },
      closeBind () {
        this.hideBind = true
      }
    }
  }
</script>
<style lang="scss">
@import '~/assets/css/account.scss';
  .person_body {
    width: 1200px;
    margin: 30px auto 0;
  }
  .earnings {
    .main_box {
      background: rgb(245, 245, 245);
    }
  }
</style>