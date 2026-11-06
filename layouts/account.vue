<script setup lang="ts">
  const route = useRoute()
  const menu = [
    { path: '/account/course', title: '我的课程', icon: 'book' },
    { path: '/account/collect', title: '我的收藏', icon: 'heart' },
    { path: '/account/order', title: '我的订单', icon: 'receipt' },
    { path: '/account/user', title: '个人信息', icon: 'user' }
  ]
  const current = computed(() => menu.find((item) => item.path === route.path) || menu[0])
  useHead({ title: () => current.value.title })
</script>
<template>
  <NuxtLayout name="default">
    <div class="main page-space account-shell">
      <aside class="account-nav surface" aria-label="个人中心导航">
        <div class="center-heading">
          <div class="center-mark"><CommonIcon name="book" :size="26" /></div>
          <h2>学习中心</h2>
        </div>
        <p class="eyebrow">每一天，都更进一步</p>
        <NuxtLink v-for="item in menu" :key="item.path" :to="item.path" :class="{ selected: route.path === item.path }" :aria-current="route.path === item.path ? 'page' : undefined">
          <CommonIcon :name="item.icon" :size="19" />
          {{ item.title }}
        </NuxtLink>
        <NuxtLink class="browse" to="/course/list">探索更多课程 <CommonIcon name="arrow" :size="16" /></NuxtLink>
      </aside>
      <section class="account-content" :aria-label="current.title">
        <slot />
      </section>
    </div>
  </NuxtLayout>
</template>
<style scoped>
  .account-shell {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 32px;
    align-items: start;
  }
  .account-nav {
    position: sticky;
    top: 104px;
    padding: 28px 16px 20px;
  }
  .center-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 12px 16px;
  }
  .center-mark {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: var(--brand-soft);
    color: var(--brand);
    flex-shrink: 0;
  }
  .account-nav .eyebrow {
    margin-left: 12px;
    margin-bottom: 24px;
  }
  .account-nav .eyebrow {
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 1px;
  }
  .account-nav h2 {
    font-size: 20px;
    margin: 0;
    white-space: nowrap;
  }
  .account-nav a {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    margin: 6px 0;
    border-radius: 9px;
    color: var(--muted);
    font-size: 14px;
    transition:
      background-color 0.2s,
      color 0.2s;
  }
  .account-nav a:hover,
  .account-nav a.selected {
    background: var(--brand-soft);
    color: var(--brand);
  }
  .account-nav a.selected {
    font-weight: 600;
  }
  .account-nav a.selected::before {
    content: '';
    position: absolute;
    left: 0;
    top: 14px;
    bottom: 14px;
    width: 3px;
    background: var(--brand);
    border-radius: 4px;
  }
  .account-nav .browse {
    justify-content: center;
    gap: 10px;
    min-height: 42px;
    margin: 28px 0 0;
    padding: 10px 12px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: var(--muted);
    font-size: 13px;
    font-weight: 550;
  }
  .account-nav .browse:hover {
    background: transparent;
    color: var(--brand);
  }
  .account-nav .browse:focus-visible {
    outline: 2px solid var(--brand);
    outline-offset: 3px;
  }
  .account-content {
    min-width: 0;
  }
  @media (max-width: 1100px) {
    .account-shell {
      grid-template-columns: 180px minmax(0, 1fr);
      gap: 24px;
    }
    .account-nav {
      padding-left: 12px;
      padding-right: 12px;
    }
    .account-nav a {
      padding: 12px;
    }
    .account-nav .eyebrow {
      font-size: 10px;
      letter-spacing: 0;
    }
    .center-heading {
      gap: 8px;
      margin-left: 4px;
      margin-right: 4px;
    }
    .center-mark {
      width: 36px;
      height: 36px;
      border-radius: 10px;
    }
    .account-nav h2 {
      font-size: 18px;
    }
  }
</style>
