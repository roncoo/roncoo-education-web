<template>
  <NuxtLayout>
    <div class="main course-list">
      <!-- 讲师列表 -->
      <lecturer-list v-loading="page.loading" :list="page.list" />

      <!-- 分页功能 -->
      <div v-if="page.totalCount >= 1" class="pagination clearfix">
        <common-pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup>
  import useTable from '~/utils/table.js'
  import { indexApi } from '~/api'
  import { lecturerApi } from '~/api/lecturer'

  // 分页查询
  const { page, handlePage } = reactive({
    ...useTable({
      page: lecturerApi.lecturerList
    })
  })

  const { data } = useAsyncData('website', async () => {
    return await indexApi.websiteInfo()
  })
  useHead({
    title: '讲师列表',
    meta: [
      { hid: 'keywords', name: 'keywords', content: '领课网络、在线教育系统、开源教育系统、roncoo-education' },
      { hid: 'description', name: 'description', content: data.value?.websiteDesc }
    ]
  })
</script>
<style lang="scss" scoped>
  .course-list {
    padding: 10px 0;
  }
</style>
