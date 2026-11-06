<script setup>
  import { indexApi } from '~/api'
  const { data: list, error, refresh } = useAsyncData('home-categories', () => indexApi.categoryList(), { default: () => [] })
</script>
<template>
  <CommonState v-if="error" error @retry="refresh" />
  <section v-else-if="list.length" class="category-strip surface" aria-label="课程分类">
    <header>
      <h2>课程分类</h2>
      <NuxtLink to="/course/list">
        全部分类
        <CommonIcon name="arrow" :size="16" />
      </NuxtLink>
    </header>
    <div class="category-grid">
      <NuxtLink v-for="item in list" :key="item.id" :to="{ path: '/course/list', query: { categoryId: item.id } }">
        <span>{{ item.categoryName }}</span>
      </NuxtLink>
    </div>
  </section>
</template>
<style scoped>
  .category-strip {
    padding: 24px;
    margin: 0 0 44px;
    border-radius: 16px;
  }
  .category-strip header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    margin-bottom: 18px;
  }
  .category-strip h2 {
    font-size: 18px;
    margin: 0;
    font-weight: 600;
  }
  .category-strip header a {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    white-space: nowrap;
    color: var(--muted);
  }
  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
    gap: 12px;
  }
  .category-grid > a {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 64px;
    padding: 14px 12px;
    border: 1px solid #edf1f7;
    border-radius: 10px;
    background: #f7f9fc;
    color: #465975;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.6;
    text-align: center;
    transition:
      background-color 0.2s,
      color 0.2s,
      border-color 0.2s;
  }
  .category-grid > a:hover,
  .category-grid > a:focus-visible {
    background: var(--brand-soft);
    color: var(--brand);
    border-color: #bfdbfe;
  }
  .category-grid > a > span:last-child {
    text-wrap: balance;
  }
  @media (max-width: 1100px) {
    .category-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }
  }
</style>
