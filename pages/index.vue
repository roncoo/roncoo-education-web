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
  import { indexApi } from '~/api/index'

  const { data: info } = await useAsyncData('index', async (ctx) => {
    return indexApi.websiteInfo()
  })

  useHead({
    title: info.value?.websiteName,
    meta: [
      { hid: 'keywords', name: 'keywords', content: info.value?.websiteName },
      { hid: 'description', name: 'description', content: info.value?.websiteDesc }
    ]
  })
</script>
<style lang="scss" scoped></style>
