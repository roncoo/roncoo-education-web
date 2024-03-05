<template>
  <NuxtLayout name="account">
    <el-table v-loading="page.loading" :border="false" :data="page.list" :show-header="false">
      <el-table-column label="课程">
        <template #default="scope">
          <img :src="scope.row.courseResp.courseLogo" :alt="scope.row.courseResp.courseName" class="course-img" />
          <div class="course-info">
            <div class="course-info-title">{{ scope.row.courseResp.courseName }}<span v-if="scope.row.courseResp.isFree === 1" style="margin: 0">【免费课】</span></div>
            <div v-if="scope.row.periodName">学习至：{{ scope.row.periodName }}（{{ scope.row.periodProgress }}%）| {{ scope.row.periodTime }}</div>
            <div>总进度：{{ scope.row.courseProgress ? item.courseProgress : 0 }}%</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column :width="200" align="center" label="操作">
        <template #default="scope">
          <nuxt-link :to="{ name: 'course-study', query: { id: scope.row.courseResp.id } }" link plain type="primary">
            <el-button plain> 继续学习 </el-button>
          </nuxt-link>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="page.totalCount >= 1" class="pagination">
      <common-pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
    </div>
  </NuxtLayout>
</template>
<script setup>
  import useTable from '~/utils/table.js'
  import { userApi as usersApi } from '~/api/user.js'

  const { page, handlePage } = reactive({
    ...useTable({
      page: usersApi.userCoursePage
    })
  })
</script>
<style lang="scss" scoped>
  .course-img {
    float: left;
    height: 100px;
  }
  .course-info {
    float: left;
    font-size: 12px;
    div {
      margin-left: 20px;
      height: 33px;
      line-height: 33px;
    }
  }
</style>
