<template>
  <NuxtLayout>
    <div class="main">
      <zone-banner />
      <zone-course />
    </div>
    <common-link />
  </NuxtLayout>
</template>
<script setup>
  useHead({
    title: '首页',
    meta: [
      { hid: 'keywords', name: 'keywords', content: '首页' },
      { hid: 'description', name: 'description', content: '首页' }
    ]
  })
</script>
<style lang="scss" scoped></style>
