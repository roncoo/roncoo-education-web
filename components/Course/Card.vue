<script setup lang="ts">
  interface Course {
    id: string
    courseLogo?: string
    courseName?: string
    coursePrice?: number
    rulingPrice?: number
    courseCollect?: boolean
  }
  defineProps<{ course: Course }>()
  const money = (value: number = 0) => new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(value)
</script>
<template>
  <article class="course-card">
    <NuxtLink class="course-cover" :to="{ path: '/course/detail', query: { id: course.id } }">
      <CommonImage :src="course.courseLogo" :alt="course.courseName" />
      <span class="cover-action" aria-hidden="true">
        <CommonIcon name="play" :size="20" />
        查看课程
      </span>
      <span v-if="course.coursePrice === 0" class="free-tag">免费课程</span>
    </NuxtLink>
    <div class="card-body">
      <NuxtLink :to="{ path: '/course/detail', query: { id: course.id } }">
        <h3 class="course-title">{{ course.courseName || '课程详情' }}</h3>
      </NuxtLink>
      <div class="card-bottom">
        <div>
          <strong :class="['price', { free: course.coursePrice === 0 }]">{{ course.coursePrice === 0 ? '免费' : money(course.coursePrice) }}</strong>
          <del v-if="Number(course.rulingPrice) > Number(course.coursePrice)">{{ money(course.rulingPrice) }}</del>
        </div>
        <CourseCollect :course-id="course.id" :collect-status="course.courseCollect" />
      </div>
    </div>
  </article>
</template>
<style scoped>
  .course-card {
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: white;
    transition:
      transform 0.22s,
      box-shadow 0.22s,
      border-color 0.22s;
    box-shadow: 0 3px 12px #172b4d03;
  }
  .course-card:hover,
  .course-card:focus-within {
    transform: translateY(-4px);
    border-color: #cfddf7;
    box-shadow: 0 14px 32px #172b4d0d;
  }
  .course-cover {
    display: block;
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
    background: var(--brand-soft);
  }
  .course-cover :deep(img),
  .course-cover :deep(.image-placeholder) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s;
  }
  .course-card:hover .course-cover :deep(img) {
    transform: scale(1.035);
  }
  .cover-action {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background: #12274259;
    color: white;
    font-size: 13px;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .course-card:hover .cover-action,
  .course-card:focus-within .cover-action {
    opacity: 1;
  }
  .free-tag {
    position: absolute;
    top: 12px;
    left: 12px;
    border-radius: 5px;
    background: #ffffffed;
    color: #18764f;
    padding: 4px 9px;
    font-size: 11px;
    font-weight: 600;
    box-shadow: 0 2px 8px #0000000a;
  }
  .card-body {
    padding: 18px 18px 16px;
  }
  .course-title {
    font-size: 16px;
    font-weight: 600;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.65;
    height: 3.3em;
    margin: 0 0 18px;
    color: var(--ink);
  }
  .course-card a:hover .course-title {
    color: var(--brand);
  }
  .card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    padding-top: 14px;
    border-top: 1px solid #f0f3f8;
  }
  .card-bottom > div {
    min-width: 0;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 5px;
  }
  .price {
    font-size: 21px;
    font-weight: 650;
    letter-spacing: -0.4px;
    color: #c24e28;
    font-variant-numeric: tabular-nums;
  }
  .price.free {
    color: #18764f;
  }
  del {
    font-size: 11px;
    color: var(--muted);
  }
  .card-bottom :deep(.collect-button) {
    padding-right: 0;
  }
  @media (max-width: 1100px) {
    .card-body {
      padding: 20px;
    }
    .course-title {
      font-size: 17px;
    }
  }
</style>
