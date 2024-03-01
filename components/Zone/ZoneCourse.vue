<template>
  <div v-for="(item, index) in zoneData" :key="index" class="i_content">
    <div class="i_zone">
      <div class="zone_header">
        <div class="big_text">
          <span class="col_block" />
          {{ item.zoneName }}
          <span class="small_text">{{ item.zoneDesc }}</span>
          <nuxt-link :to="{ name: 'course-list' }" class="fr small_text link_text">更多课程 ></nuxt-link>
        </div>
      </div>
      <course-list :course-list="item.courseList" />
    </div>
  </div>
</template>
<script setup>
  import { indexApi } from '@/api/index.js'
  import CourseList from '~/components/Course/CourseList.vue'

  const zoneData = ref()
  onMounted(async () => {
    const res = await indexApi.zoneList({})
    zoneData.value = res
  })
</script>
<style lang="scss" scoped>
  .i_content {
    background: #f6f8fb;
    .i_zone {
      .zone_header {
        .col_block {
          display: inline-block;
          width: 4px;
          height: 24px;
          background: #333;
          position: relative;
          top: 4px;
        }

        .big_text {
          font-size: 24px;
        }

        .small_text {
          font-size: 14px;
          color: #999;
          margin-top: 10px;
        }

        .link_text:hover {
          text-decoration: none;
          color: #333;
        }
      }
    }
  }
</style>
