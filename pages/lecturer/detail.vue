<template>
  <NuxtLayout>
    <div class="lecturer">
      <div class="lecturer-info">
        <img :src="lecturerInfo.lecturerHead" :alt="lecturerInfo.lecturerName" />
        <div class="item-info">
          <div>{{ lecturerInfo.lecturerName }} {{ lecturerInfo.lecturerPosition }}</div>
          <div v-html="lecturerInfo.introduce" />
        </div>
      </div>
    </div>
    <div class="course">
      <div v-if="lecturerInfo.courseViewVO.length > 0" class="course-info">
        <!-- 课程列表 -->
        <course-list :list="lecturerInfo.courseViewVO" />
      </div>
      <div v-else class="no-data">暂无数据</div>
    </div>
  </NuxtLayout>
</template>
<script setup>
  import { lecturerApi } from '~/api/lecturer'
  const route = useRoute()
  const { data: lecturerInfo } = await useAsyncData('lecturer-detail' + route.query.id, async () => {
    return lecturerApi.lecturerDetail({ id: route.query.id })
  })
  useHead({
    title: lecturerInfo.value?.lecturerName,
    meta: [
      { hid: 'keywords', name: 'keywords', content: '领课网络、在线教育系统、开源教育系统、roncoo-education' },
      { hid: 'description', name: 'description', content: lecturerInfo.value?.introduce }
    ]
  })
</script>
<style lang="scss" scoped>
  .lecturer {
    background: #39364d;
    color: #fff;

    .lecturer-info {
      width: 1200px;
      margin: 0 auto;
      border-radius: 10px;
      padding: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
      }
      .item-info {
        margin-left: 20px;
        font-size: 14px;
        line-height: 25px;
      }
    }
  }

  .course {
    .course-info {
      width: 1200px;
      margin: 0 auto;
    }
  }
</style>
