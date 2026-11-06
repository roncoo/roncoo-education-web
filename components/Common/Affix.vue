<script setup lang="ts">
  import phoneIcon from '~/assets/svg/phone.svg'
  import wechatIcon from '~/assets/svg/gzh.svg'
  import phoneQr from '~/assets/image/phone.png'
  import wechatQr from '~/assets/image/gzh.jpg'

  const showBackToTop = ref(false)
  function updateBackToTop() {
    showBackToTop.value = window.scrollY > 400
  }
  onMounted(() => {
    updateBackToTop()
    window.addEventListener('scroll', updateBackToTop, { passive: true })
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', updateBackToTop)
  })

  const entries = [
    { label: '商业版', title: '商业版咨询', description: '扫码了解商业版服务', icon: phoneIcon, qr: phoneQr },
    { label: '公众号', title: '关注公众号', description: '扫码关注微信公众号', icon: wechatIcon, qr: wechatQr }
  ]
  function backToTop() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
  }
</script>
<template>
  <aside class="affix" aria-label="侧边工具栏">
    <div v-for="entry in entries" :key="entry.label" class="affix-item">
      <ElPopover placement="left" :width="208" :offset="14" :trigger="['hover', 'focus']" :show-after="100" :hide-after="120" popper-class="support-popover">
        <template #reference>
          <button class="affix-action" type="button" :aria-label="entry.title + '，显示二维码'">
            <span class="affix-icon"><img :src="entry.icon" width="24" height="24" alt="" /></span>
            <span>{{ entry.label }}</span>
          </button>
        </template>
        <div class="support-content">
          <h3>{{ entry.title }}</h3>
          <img class="support-qr" :src="entry.qr" :alt="entry.title + '二维码'" width="156" height="156" />
          <p>{{ entry.description }}</p>
        </div>
      </ElPopover>
    </div>
    <div v-if="showBackToTop" class="affix-item">
      <button class="affix-action" type="button" aria-label="回到顶部" @click="backToTop">
        <span class="affix-icon"><CommonIcon name="arrow" :size="24" class="up-arrow" /></span>
        <span>回到顶部</span>
      </button>
    </div>
  </aside>
</template>
<style scoped>
  .affix {
    position: fixed;
    z-index: 90;
    right: 5px;
    top: 40vh;
    width: 72px;
    padding: 6px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: var(--surface);
    box-shadow: 0 8px 28px #172b4d0d;
  }
  .affix-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
    width: 100%;
    min-height: 78px;
    padding: 10px 0;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: var(--muted);
    font-size: 12px;
    line-height: 18px;
    transition:
      background-color 0.2s,
      color 0.2s;
  }
  .affix-item + .affix-item {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid var(--line);
  }
  .up-arrow {
    transform: rotate(-90deg);
  }
  .affix-icon {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: var(--canvas);
    transition: background-color 0.2s;
  }
  .affix-icon img {
    object-fit: contain;
  }
  .affix-action:hover,
  .affix-action:focus-visible {
    color: var(--brand);
    background: var(--brand-soft);
  }
  .affix-action:hover .affix-icon,
  .affix-action:focus-visible .affix-icon {
    background: #dbeafe;
  }
  .support-content {
    text-align: center;
    padding: 8px 4px;
  }
  .support-content h3 {
    margin: 0 0 14px;
    color: var(--ink);
    font-size: 15px;
    font-weight: 600;
  }
  .support-qr {
    display: block;
    margin: 0 auto;
    padding: 6px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: white;
    object-fit: contain;
  }
  .support-content p {
    margin: 12px 0 0;
    color: var(--muted);
    font-size: 12px;
  }
  @media (width > 1400px) {
    .affix {
      left: calc(50% + 620px);
      right: auto;
    }
  }
</style>
<style>
  .el-popover.el-popper.support-popover {
    border: 1px solid var(--line);
    border-radius: 16px;
    box-shadow: 0 12px 36px #172b4d14;
  }
</style>
