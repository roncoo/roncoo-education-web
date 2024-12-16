<template>
  <div class="course-live">
    <iframe :src="watchUrl" class="live-iframe" allowfullscreen="true" allow="microphone;camera" />
  </div>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'
  const route = useRoute()

  useHead({
    title: '直播课程',
    meta: [
      { hid: 'keywords', name: 'keywords', content: '直播课程' },
      { hid: 'description', name: 'description', content: '直播课程' }
    ]
  })

  const watchUrl = ref()
  onMounted(async () => {
    const studyRes = await courseApi.studySign({ periodId: route.query.periodId, courseId: route.query.id })
    watchUrl.value = studyRes.liveViewConfig
  })
</script>
<style lang="scss">
  .course-live {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
  }
  .live-iframe {
    border: none;
    margin: 0 auto;
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
