<script setup>
  import { lecturerApi } from '~/api/lecturer'
  const route = useRoute()
  const {
    data: info,
    status,
    error,
    refresh
  } = useAsyncData(
    () => 'lecturer-detail-' + route.query.id,
    () => lecturerApi.lecturerDetail({ id: route.query.id })
  )
  useHead({ title: () => info.value?.lecturerName || '讲师详情' })
</script>
<template>
  <NuxtLayout>
    <div class="main page-space">
      <CommonState :loading="status === 'pending'" :error="!!error" @retry="refresh" />
      <template v-if="info && !error">
        <section class="lecturer-profile surface">
          <CommonImage class="portrait" :src="info.lecturerHead" :alt="info.lecturerName" :width="128" :height="128" eager />
          <div>
            <p class="eyebrow">认识你的讲师</p>
            <h1>{{ info.lecturerName }}</h1>
            <p class="position">{{ info.lecturerPosition }}</p>
            <div class="rich-content" v-html="info.introduce" />
          </div>
        </section>
        <header class="page-heading">
          <div>
            <h2>讲师课程</h2>
            <p>从一门课程开始新的探索</p>
          </div>
        </header>
        <CourseList :list="info.courseViewVO || []" />
      </template>
    </div>
  </NuxtLayout>
</template>
<style scoped>
  .lecturer-profile {
    display: flex;
    gap: 32px;
    padding: 40px;
    margin-bottom: 36px;
    background: linear-gradient(110deg, #eff6ff, white);
  }
  .portrait {
    width: 128px;
    height: 128px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .lecturer-profile h1 {
    margin-bottom: 6px;
  }
  .position {
    color: var(--muted);
  }
  .lecturer-profile > div {
    min-width: 0;
    flex: 1;
  }
</style>
