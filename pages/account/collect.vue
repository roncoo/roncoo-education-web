<script setup>
  import useTable from '~/utils/table'
  import { userApi } from '~/api/user'
  const { page, handlePage } = useTable({ page: userApi.userCourseCollectPage })
  const courses = computed(() => page.list.map((item) => item.courseResp && { ...item.courseResp, courseCollect: true }).filter(Boolean))
</script>
<template>
  <NuxtLayout name="account">
    <CommonState :loading="page.loading" :error="page.error" :empty="!courses.length" title="收藏你感兴趣的课程" description="在课程卡片上点击收藏，方便下次继续探索。" @retry="handlePage" />
    <div v-if="!page.loading && !page.error && courses.length" class="saved-courses"><CourseCard v-for="course in courses" :key="course.id" :course="course" /></div>
    <div v-if="!page.loading && !page.error && courses.length > 0 && page.totalCount > 0" class="pagination">
      <CommonPagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
    </div>
  </NuxtLayout>
</template>
<style scoped>
  .saved-courses {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }
  @media (max-width: 1100px) {
    .saved-courses {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
