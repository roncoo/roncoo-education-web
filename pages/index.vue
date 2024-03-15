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

  const { data } = await useAsyncData('index', async () => {
    return await indexApi.websiteInfo()
  })
  useHead({
    title: data.value?.websiteName,
    meta: [
      { hid: 'keywords', name: 'keywords', content: '领课网络、在线教育系统、开源教育系统、roncoo-education' },
      { hid: 'description', name: 'description', content: data.value?.websiteDesc }
    ]
  })
</script>
<style lang="scss" scoped></style>
