<script setup>
  const { data } = useWebsite()
  useHead({ title: () => data.value?.websiteName || '在线网校', meta: [{ name: 'description', content: () => data.value?.websiteDesc }] })
</script>
<template>
  <NuxtLayout>
    <div class="main page-space home-page">
      <ZoneBanner />
      <ZoneCourse />
    </div>
    <CommonLink />
  </NuxtLayout>
</template>
