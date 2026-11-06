<script setup>
  import { indexApi } from '~/api'
  const route = useRoute()
  const router = useRouter()
  const { data: info } = useWebsite()
  const { data: nav } = useAsyncData('website-nav', () => indexApi.websiteNav(), { default: () => [] })
  const loginStatus = ref(false)
  const search = ref('')
  const items = computed(() =>
    nav.value?.length
      ? nav.value
      : [
          { navTitle: '首页', navUrl: '/' },
          { navTitle: '全部课程', navUrl: '/course/list' },
          { navTitle: '名师团队', navUrl: '/lecturer/list' }
        ]
  )
  const isActive = (url) => {
    if (url === '/') return route.path === '/'
    const path = String(url || '').split('?')[0]
    if (path.startsWith('/course/')) return route.path.startsWith('/course/')
    if (path.startsWith('/lecturer/')) return route.path.startsWith('/lecturer/')
    return !!path && route.path.startsWith(path)
  }
  watch(
    () => route.fullPath,
    () => {
      search.value = String(route.query.kw || '')
      if (import.meta.client) loginStatus.value = !!getToken()
    },
    { immediate: true }
  )
  onMounted(() => {
    loginStatus.value = !!getToken()
  })
  function handleSearch() {
    router.push({ path: '/search', query: { kw: search.value.trim() || undefined } })
  }
</script>
<template>
  <header class="site-header">
    <div class="main header-inner">
      <NuxtLink class="brand" to="/" :aria-label="info?.websiteName || '网校首页'">
        <img v-if="info?.websiteLogo" :src="info.websiteLogo" :alt="info.websiteName || '网校'" width="144" height="36" />
        <span v-else>{{ info?.websiteName || '在线网校' }}</span>
      </NuxtLink>
      <nav class="primary-nav" aria-label="主导航">
        <template v-for="item in items" :key="item.navUrl">
          <a v-if="isExternalUrl(item.navUrl)" :href="item.navUrl" :target="item.target" rel="noopener noreferrer">{{ item.navTitle }}</a>
          <NuxtLink v-else :to="item.navUrl || '/'" :class="{ active: isActive(item.navUrl) }" :aria-current="isActive(item.navUrl) ? 'page' : undefined">{{ item.navTitle }}</NuxtLink>
        </template>
      </nav>
      <form class="header-search" role="search" @submit.prevent="handleSearch">
        <input v-model="search" name="kw" aria-label="搜索课程或讲师" placeholder="搜索课程或讲师…" />
        <button type="submit" aria-label="搜索"><CommonIcon name="search" :size="18" /></button>
      </form>
      <NuxtLink class="learning-link" to="/account/course">
        <CommonIcon name="book" :size="17" />
        我的课程
      </NuxtLink>
      <CommonUser v-if="loginStatus" />
      <div v-else class="auth-links">
        <NuxtLink to="/login">登录</NuxtLink>
        <NuxtLink class="button-link primary" to="/register">注册</NuxtLink>
      </div>
    </div>
  </header>
</template>
<style scoped>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fffffff5;
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--line);
  }
  .header-inner {
    display: flex;
    gap: 28px;
    align-items: center;
    min-height: 76px;
  }
  .brand {
    flex-shrink: 0;
    font-size: 22px;
    font-weight: 750;
    color: var(--ink);
  }
  .brand img {
    object-fit: contain;
    max-width: 144px;
  }
  .primary-nav {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .primary-nav a {
    display: flex;
    align-items: center;
    white-space: nowrap;
    justify-content: center;
    min-height: 40px;
    padding: 0 16px;
    border-radius: 10px;
    font-weight: 400;
    font-size: 16px;
    transition:
      background-color 0.2s,
      color 0.2s;
  }
  .primary-nav a:hover {
    color: var(--brand);
    background: var(--canvas);
  }
  .primary-nav .active {
    color: var(--brand);
    background: var(--brand-soft);
    font-weight: 650;
  }
  .primary-nav .active:hover {
    background: var(--brand-soft);
  }
  .header-search {
    margin-left: auto;
    display: flex;
    width: 230px;
    height: 36px;
    min-width: 150px;
    background: var(--canvas);
    border: 1px solid var(--line);
    border-radius: 24px;
  }
  .header-search input {
    border: 0;
    outline: 0;
    background: transparent;
    width: 100%;
    min-width: 0;
    padding: 0 12px;
    font-size: 14px;
    line-height: 20px;
    color: var(--ink);
  }
  .header-search:focus-within {
    outline: 2px solid #93b4f5;
  }
  .header-search button {
    border: 0;
    background: transparent;
    color: var(--muted);
    display: grid;
    place-items: center;
    padding: 0 14px;
  }
  .learning-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    white-space: nowrap;
    color: var(--muted);
  }
  .auth-links {
    display: flex;
    align-items: center;
    gap: 16px;
    white-space: nowrap;
  }
  .auth-links .button-link {
    min-height: 36px;
    padding: 6px 16px;
  }
  @media (max-width: 1100px) {
    .header-inner {
      gap: 18px;
    }
    .primary-nav {
      gap: 4px;
    }
    .primary-nav a {
      padding: 0 12px;
    }
    .header-search {
      width: 190px;
    }
    .brand img {
      max-width: 120px;
    }
  }
</style>
