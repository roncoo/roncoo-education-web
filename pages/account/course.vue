<script setup>
  import useTable from '~/utils/table'
  import { userApi } from '~/api/user'
  const { page, handlePage } = useTable({ page: userApi.userCoursePage })
</script>
<template>
  <NuxtLayout name="account">
    <CommonState :loading="page.loading" :error="page.error" :empty="!page.list.length" title="你的学习旅程从这里开始" description="选择一门喜欢的课程，开始积累新的能力。" @retry="handlePage" />
    <template v-if="!page.loading && !page.error">
      <AccountLearningCard v-for="item in page.list" :key="item.id || item.courseResp?.id" :item="item" />
      <div v-if="page.list.length > 0 && page.totalCount > 0" class="pagination">
        <CommonPagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
      </div>
    </template>
  </NuxtLayout>
</template>
