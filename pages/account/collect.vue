<template>
  <NuxtLayout name="account">
    <el-table v-loading="page.loading" :border="false" :data="page.list" :show-header="false">
      <el-table-column label="课程">
        <template #default="scope">
          <img :src="scope.row.courseResp.courseLogo" :alt="scope.row.courseResp.courseName" class="course-img" />
          <div class="course-info">
            <div class="course-info-title">{{ scope.row.courseResp.courseName }}<span v-if="scope.row.courseResp.isFree === 1" style="margin: 0">【免费课】</span></div>
            <div>购买人数：{{ scope.row.courseResp.countBuy }}</div>
            <div>学习人数：{{ scope.row.courseResp.countStudy }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :width="200" align="center" label="操作">
        <template #default="scope">
          <nuxt-link :to="{ name: 'course-detail', query: { id: scope.row.courseResp.id } }" link plain type="primary">
            <el-button plain> 马上学习 </el-button>
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
  import { userApi } from '~/api/user.js'

  const { page, handlePage } = useTable({
    page: userApi.userCourseCollectPage
  })
</script>
<style lang="scss" scoped>
  .course-img {
    float: left;
    height: 100px;
    width: 180px;
    border-radius: 6px;
  }
  .course-info {
    float: left;
    font-size: 12px;
    .course-info-title {
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    div {
      margin-left: 20px;
      height: 33px;
      line-height: 33px;
    }
  }
</style>
