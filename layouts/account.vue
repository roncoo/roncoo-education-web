<template>
  <common-header />
  <slot />
  <common-footer />
</template>
<script setup>
  import CommonFooter from '~/components/Common/CommonFooter.vue'
  import CommonHeader from '~/components/Common/CommonHeader.vue'
</script>
