<script setup>
  import { indexApi } from '~/api'
  const { data: list, status, error, refresh } = useAsyncData('home-carousel', () => indexApi.carouselList(), { default: () => [] })
</script>
<template>
  <section class="banner" aria-label="精选课程活动">
    <CommonState v-if="error" error @retry="refresh" />
    <ElSkeleton v-else-if="status === 'pending'" class="banner-skeleton" :rows="5" animated />
    <ElCarousel v-else-if="list.length" height="360px" :autoplay="false" indicator-position="inside">
      <ElCarouselItem v-for="(item, index) in list" :key="item.id || index">
        <a :href="item.carouselUrl || '/course/list'" :target="item.carouselTarget" rel="noopener noreferrer">
          <CommonImage :src="item.carouselImg" :alt="item.carouselTitle" :width="1200" :height="360" :eager="index === 0" />
        </a>
      </ElCarouselItem>
    </ElCarousel>
    <div v-else class="banner-fallback">
      <p class="eyebrow">EXPLORE · LEARN · GROW</p>
      <h2>
        让每一次学习
        <br />
        都成为向前的一步
      </h2>
      <p>发现适合你的课程，从这里开启学习。</p>
      <NuxtLink class="button-link primary" to="/course/list">探索全部课程 <CommonIcon name="arrow" :size="16" /></NuxtLink>
    </div>
  </section>
</template>
<style scoped>
  .banner {
    border-radius: 18px;
    overflow: hidden;
    background: #eaf1ff;
    margin-bottom: 24px;
  }
  .banner a {
    display: block;
    height: 100%;
  }
  .banner :deep(img),
  .banner :deep(.image-placeholder) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .banner-fallback {
    padding: 48px 56px;
    background: radial-gradient(circle at 85% 20%, #d5e4ff, transparent 45%), linear-gradient(110deg, #edf3ff, #f8faff);
  }
  .banner-fallback h2 {
    font-size: 36px;
    line-height: 1.5;
    margin-bottom: 12px;
  }
  .banner-fallback > p:not(.eyebrow) {
    color: var(--muted);
    margin-bottom: 24px;
  }
  .banner-skeleton {
    padding: 48px;
  }
</style>
