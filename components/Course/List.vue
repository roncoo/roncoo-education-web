<script setup>
  defineProps({ list: { type: Array, default: () => [] } })
</script>
<template>
  <CommonState v-if="!list.length" empty title="没有找到相关课程" description="试试其他分类或关键词，发现适合你的课程。" />
  <div v-else class="course-grid"><CourseCard v-for="course in list" :key="course.id" :course="course" /></div>
</template>
<style scoped>
  .course-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
  }
  @media (max-width: 1100px) {
    .course-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
