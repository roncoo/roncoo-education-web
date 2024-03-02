<template>
  <common-header />
  <slot />
  <common-footer />
</template>
<script setup>
  import CommonFooter from '~/components/Common/Footer.vue'
  import CommonHeader from '~/components/Common/Header.vue'
</script>
