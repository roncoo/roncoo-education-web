<script setup>
  useHead({ title: '页面不存在' })
</script>
<template>
  <NuxtLayout>
    <section class="main not-found">
      <p class="error-code">404</p>
      <h1>这个页面暂时找不到了</h1>
      <p>链接可能已失效，你可以返回首页或继续探索课程。</p>
      <div>
        <NuxtLink class="button-link primary" to="/">返回首页</NuxtLink>
        <NuxtLink class="button-link" to="/course/list">浏览课程 <CommonIcon name="arrow" :size="16" /></NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>
<style scoped>
  .not-found {
    text-align: center;
    padding: 80px 24px 100px;
  }
  .error-code {
    font-size: 100px;
    line-height: 1.3;
    color: #b9cdf6;
    font-weight: 800;
    margin-bottom: 20px;
    letter-spacing: 8px;
  }
  .not-found > p:not(.error-code) {
    color: var(--muted);
    margin-bottom: 28px;
  }
  .not-found > div {
    display: flex;
    gap: 16px;
    justify-content: center;
  }
</style>
