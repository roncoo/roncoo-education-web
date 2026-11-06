<script setup>
  const { data: info } = useWebsite()
</script>
<template>
  <footer class="site-footer">
    <div class="main">
      <div class="footer-top">
        <div class="footer-brand">
          <CommonImage v-if="info?.websiteIcon" class="footer-mark" :src="info.websiteIcon" :alt="info.websiteName || '站点 Logo'" :width="46" :height="46" />
          <div>
            <strong>{{ info?.websiteName || '在线网校' }}</strong>
            <p>让学习成为持续向前的力量</p>
          </div>
        </div>
        <nav class="footer-navigation" aria-label="页脚导航">
          <NuxtLink to="/course/list">探索课程</NuxtLink>
          <NuxtLink to="/lecturer/list">名师团队</NuxtLink>
          <NuxtLink to="/account/course">
            学习中心
            <CommonIcon name="arrow" :size="16" />
          </NuxtLink>
        </nav>
      </div>
      <div class="footer-bottom">
        <div v-if="info?.websiteCopyright" v-html="info.websiteCopyright" />
        <div class="legal-links">
          <a v-if="info?.websiteIcp" href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">{{ info.websiteIcp }}</a>
          <a v-if="info?.websitePrn" :href="'https://beian.mps.gov.cn/#/query/webSearch?code=' + info.websitePrnNo" target="_blank" rel="noopener noreferrer">{{ info.websitePrn }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
<style scoped>
  .site-footer {
    background: #172b49;
    color: #a9b9cf;
    margin-top: 24px;
  }
  .footer-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    padding: 40px 0 32px;
  }
  .footer-brand {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  .footer-mark {
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    object-fit: contain;
    border-radius: 12px;
  }
  .footer-brand strong {
    font-size: 18px;
    font-weight: 550;
    color: #f1f5fc;
    letter-spacing: 0.5px;
  }
  .footer-brand p {
    font-size: 12px;
    margin: 6px 0 0;
    color: #a3b5cd;
  }
  .footer-navigation {
    display: flex;
    align-items: center;
    gap: 32px;
    font-size: 13px;
  }
  .footer-navigation a {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .site-footer a:hover {
    color: white;
  }
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    border-top: 1px solid #ffffff10;
    padding: 22px 0 26px;
    font-size: 11px;
    color: #a3b5cd;
  }
  .legal-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px 20px;
  }
  @media (max-width: 1100px) {
    .footer-navigation {
      gap: 24px;
    }
    .footer-bottom {
      align-items: start;
    }
    .legal-links {
      max-width: 55%;
    }
  }
</style>
