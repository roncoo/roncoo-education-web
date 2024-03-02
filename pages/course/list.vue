<template>
  <NuxtLayout>
    <course-list :course-list="page.list" />
  </NuxtLayout>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'
  import CourseList from '~/components/Course/List.vue'

  // 分页条件
  const page = ref({
    pageCurrent: 1
  })

  onMounted(() => {
    handlePage()
  })

  async function handlePage() {
    const res = await courseApi.courseList(page)
    page.value = res
  }
</script>
<style lang="scss" scoped></style>
