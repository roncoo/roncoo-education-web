<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">跳至主要内容</a>
    <CommonHeader />
    <CommonAffix />
    <main id="main-content" class="site-content"><slot /></main>
    <CommonFooter />
  </div>
</template>
<style scoped>
  .site-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .site-content {
    flex: 1;
    min-width: 0;
  }
</style>
