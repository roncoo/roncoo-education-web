<template>
  <header class="home-welcome">
    <div class="welcome-copy">
      <p class="eyebrow">
        <span></span>
        发现新知，持续成长
      </p>
      <h1>
        把好奇，变成
        <span>新的能力。</span>
      </h1>
      <p class="welcome-description">找到适合自己的好课，让每一次学习都有所收获。</p>
    </div>
    <NuxtLink class="learning-shortcut" to="/account/course">
      <span class="shortcut-icon"><CommonIcon name="book" :size="25" /></span>
      <div>
        <small>我的学习空间</small>
        <strong>接着上一次，继续向前</strong>
      </div>
      <CommonIcon name="arrow" :size="16" />
    </NuxtLink>
  </header>
</template>
<style scoped>
  .home-welcome {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
    margin: 4px 0 32px;
  }
  .welcome-copy {
    min-width: 0;
  }
  .eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: 1.6px;
    margin-bottom: 14px;
  }
  .eyebrow span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
  .welcome-copy h1 {
    font-size: 34px;
    font-weight: 650;
    letter-spacing: -1px;
    margin-bottom: 12px;
    line-height: 1.35;
  }
  .welcome-copy h1 > span {
    color: var(--brand);
  }
  .welcome-description {
    color: var(--muted);
    font-size: 14px;
    margin: 0;
  }
  .learning-shortcut {
    display: flex;
    align-items: center;
    gap: 18px;
    min-width: 324px;
    padding: 24px;
    border-radius: 16px;
    background: linear-gradient(110deg, #172e54, #203f71);
    color: white;
    box-shadow: 0 8px 24px #17345a15;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }
  .learning-shortcut:hover {
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 12px 30px #17345a25;
  }
  .shortcut-icon {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border: 1px solid #ffffff25;
    border-radius: 13px;
    background: #ffffff0a;
    color: #b8d0ff;
  }
  .learning-shortcut > div {
    flex: 1;
  }
  .learning-shortcut small {
    display: block;
    color: #b7c9e6;
    font-size: 12px;
    margin-bottom: 5px;
  }
  .learning-shortcut strong {
    font-size: 15px;
    font-weight: 500;
  }
  .learning-shortcut > .ui-icon {
    color: #b8d0ff;
  }
  @media (max-width: 1100px) {
    .welcome-copy h1 {
      font-size: 29px;
    }
    .learning-shortcut {
      min-width: 290px;
      padding: 20px;
      gap: 14px;
    }
  }
</style>
