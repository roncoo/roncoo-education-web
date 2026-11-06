<script setup>
  import { courseApi } from '~/api/course'
  import { setStorage } from '~/utils/storage'
  const route = useRoute()
  const {
    data: course,
    status,
    error,
    refresh
  } = useAsyncData(
    () => 'course-detail-' + route.query.id,
    () => (getToken() ? courseApi.userCourseDetail({ courseId: route.query.id }) : courseApi.courseDetail({ courseId: route.query.id }))
  )
  const pay = ref(),
    tab = ref('intro')
  useHead({ title: () => course.value?.courseName || '课程详情' })
  const price = computed(() => new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(course.value?.coursePrice || 0))
  function login() {
    setStorage('history', window.location.href, 5)
    navigateTo('/login')
  }
  function buy() {
    if (!getToken()) return login()
    pay.value?.onOpen(course.value)
  }
</script>
<template>
  <NuxtLayout>
    <div class="main page-space">
      <nav class="breadcrumbs" aria-label="面包屑">
        <NuxtLink to="/">首页</NuxtLink>
        <span>/</span>
        <NuxtLink to="/course/list">全部课程</NuxtLink>
        <span>/</span>
        <span>课程详情</span>
      </nav>
      <CommonState :loading="status === 'pending'" :error="!!error" @retry="refresh" />
      <template v-if="course && !error">
        <section class="course-hero surface">
          <div class="hero-cover-frame">
            <CommonImage class="hero-cover" :src="course.courseLogo" :alt="course.courseName" eager />
          </div>
          <div class="hero-info">
            <h1>{{ course.courseName }}</h1>
            <div class="course-stats">
              <span v-if="course.countBuy != null">{{ course.countBuy }} 人购买</span>
              <span v-if="course.countStudy != null">{{ course.countStudy }} 人学习</span>
            </div>
            <div class="price-panel">
              <span>课程价格</span>
              <strong>{{ course.coursePrice === 0 ? '免费' : price }}</strong>
              <del v-if="course.rulingPrice > course.coursePrice">¥{{ course.rulingPrice }}</del>
            </div>
            <div class="hero-actions">
              <NuxtLink v-if="course.allowStudy === 1" class="button-link primary" :to="{ path: '/course/study', query: { id: course.id } }">开始学习 <CommonIcon name="arrow" :size="16" /></NuxtLink>
              <ElButton v-else-if="course.isFree === 0" type="primary" size="large" @click="buy">立即购买</ElButton>
              <ElButton v-else type="primary" size="large" @click="login">登录观看</ElButton>
              <CourseCollect :course-id="course.id" :collect-status="course.courseCollect" />
            </div>
          </div>
        </section>
        <div class="detail-grid">
          <section class="surface course-information">
            <ElTabs v-model="tab">
              <ElTabPane name="intro" label="课程介绍">
                <div v-if="course.introduce" class="rich-content" v-html="course.introduce" />
                <CommonState v-else empty title="课程介绍正在准备中" description="你可以先查看课程目录。" action-to="" />
              </ElTabPane>
              <ElTabPane name="chapter" label="课程目录"><CourseChapter :list="course.chapterRespList || []" /></ElTabPane>
              <ElTabPane name="comment" label="学员评论"><CourseComment v-if="tab === 'comment'" :course-id="course.id" /></ElTabPane>
            </ElTabs>
          </section>
          <aside v-if="course.lecturerResp" class="surface instructor-panel">
            <h3>关于讲师</h3>
            <NuxtLink class="instructor-profile" :to="{ path: '/lecturer/detail', query: { id: course.lecturerResp.id } }">
              <CommonImage class="avatar" :src="course.lecturerResp.lecturerHead" :alt="course.lecturerResp.lecturerName" :width="64" :height="64" />
              <div>
                <strong>{{ course.lecturerResp.lecturerName }}</strong>
                <p>{{ course.lecturerResp.lecturerPosition }}</p>
              </div>
            </NuxtLink>
            <div class="rich-content" v-html="course.lecturerResp.introduce" />
          </aside>
        </div>
        <CommonPay ref="pay" @refresh="refresh" />
      </template>
    </div>
  </NuxtLayout>
</template>
<style scoped>
  .breadcrumbs {
    display: flex;
    gap: 12px;
    color: var(--muted);
    font-size: 13px;
    margin-bottom: 24px;
  }
  .course-hero {
    display: grid;
    grid-template-columns: 40% minmax(0, 1fr);
    gap: 40px;
    padding: 32px;
    background: linear-gradient(120deg, #f8faff, #fff 65%);
    margin-bottom: 28px;
    align-items: stretch;
  }
  .hero-cover-frame {
    position: relative;
    aspect-ratio: 16/9;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 28px #172b4d0d;
  }
  .hero-cover-frame .hero-cover {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .hero-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .hero-info h1 {
    font-size: 28px;
    font-weight: 650;
    line-height: 1.55;
    margin-bottom: 12px;
  }
  .course-stats {
    color: var(--muted);
    font-size: 13px;
  }
  .course-stats {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  .price-panel {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 18px;
    background: #f5f7fc;
    border-radius: 8px;
    margin-bottom: 22px;
  }
  .price-panel > span {
    color: var(--muted);
    font-size: 13px;
  }
  .price-panel strong {
    font-size: 30px;
    font-variant-numeric: tabular-nums;
    color: #c24e28;
  }
  .price-panel del {
    font-size: 13px;
    color: var(--muted);
  }
  .hero-actions {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: auto;
  }
  .hero-actions .el-button {
    min-width: 180px;
  }
  .detail-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 28px;
    align-items: start;
  }
  .course-information {
    padding: 8px 28px 28px;
    min-width: 0;
  }
  .course-information :deep(.el-tabs__item) {
    height: 56px;
  }
  .instructor-panel {
    position: sticky;
    top: 104px;
    padding: 28px 24px;
  }
  .instructor-profile {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
  }
  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .instructor-profile p {
    margin: 4px 0 0;
    color: var(--muted);
    font-size: 12px;
  }
  .instructor-panel .rich-content {
    font-size: 13px;
    color: var(--muted);
  }
  @media (max-width: 1100px) {
    .course-hero {
      grid-template-columns: 1fr;
    }
    .hero-cover-frame {
      max-height: 420px;
    }
    .detail-grid {
      grid-template-columns: 1fr;
    }
    .instructor-panel {
      position: static;
    }
  }
</style>
