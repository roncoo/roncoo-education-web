<template>
  <section class="auth-shell main">
    <div class="auth-story">
      <p class="eyebrow">学习，让可能发生</p>
      <h1>
        每一次投入，
        <br />
        都是成长的开始。
      </h1>
      <p>
        发现好课，跟随讲师，
        <br />
        用自己的节奏积累新的能力。
      </p>
      <div class="story-art" aria-hidden="true">
        <span class="art-page"></span>
        <span class="art-book">
          <CommonIcon name="book" :size="40" />
          <i></i>
          <i></i>
        </span>
        <span class="art-spark"><CommonIcon name="spark" :size="24" /></span>
        <span class="art-orbit"></span>
        <span class="art-caption">保持好奇 · 持续成长</span>
      </div>
    </div>
    <div class="auth-card surface"><slot /></div>
  </section>
</template>
<style scoped>
  .auth-shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 440px;
    gap: 64px;
    align-items: center;
    min-height: calc(100vh - 230px);
    padding-top: 48px;
    padding-bottom: 64px;
  }
  .auth-story {
    position: relative;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px;
    border-radius: 24px;
    background: radial-gradient(ellipse at 95% 95%, #2b5089, transparent 65%), #172d50;
    overflow: hidden;
    color: white;
    min-height: 590px;
  }
  .auth-story .eyebrow {
    color: #afc8f5;
    letter-spacing: 3px;
    font-size: 11px;
    margin-bottom: 24px;
  }
  .auth-story h1 {
    font-size: 36px;
    line-height: 1.6;
    letter-spacing: -0.5px;
    margin-bottom: 20px;
    font-weight: 550;
  }
  .auth-story > p:not(.eyebrow) {
    font-size: 14px;
    color: #b5c6e0;
    line-height: 2;
  }
  .auth-card {
    padding: 38px;
    border-radius: 18px;
    box-shadow: 0 16px 48px #172b4d08;
  }
  .story-art {
    position: relative;
    height: 180px;
    max-width: 340px;
    margin-top: 24px;
  }
  .art-book {
    position: absolute;
    z-index: 2;
    left: 30px;
    top: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 105px;
    height: 134px;
    background: linear-gradient(135deg, #4a83f7, #2860de);
    color: #dbe8ff;
    border: 1px solid #7aa1f46b;
    border-radius: 6px 18px 18px 6px;
    transform: rotate(-14deg);
    box-shadow: 12px 12px 26px #06182b40;
  }
  .art-book i {
    width: 40px;
    height: 2px;
    border-radius: 2px;
    background: #b9d0ff80;
  }
  .art-book i:last-child {
    width: 26px;
  }
  .art-page {
    position: absolute;
    left: 42px;
    top: 27px;
    width: 105px;
    height: 134px;
    border-radius: 6px 18px 18px 6px;
    background: #a6c2f8;
    transform: rotate(5deg);
    opacity: 0.8;
  }
  .art-orbit {
    position: absolute;
    border: 1px solid #8da9d135;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    right: -65px;
    top: -25px;
  }
  .art-orbit::after {
    content: '';
    position: absolute;
    width: 180px;
    height: 180px;
    border: 1px solid #8da9d125;
    border-radius: 50%;
    top: 29px;
    left: 29px;
  }
  .art-spark {
    position: absolute;
    right: 24px;
    top: 30px;
    color: #a5c5ff;
  }
  .art-caption {
    position: absolute;
    left: 176px;
    bottom: 28px;
    writing-mode: vertical-rl;
    letter-spacing: 4px;
    color: #b3c6e4;
    font-size: 11px;
  }
  @media (max-width: 1100px) {
    .auth-shell {
      grid-template-columns: minmax(0, 1fr) 420px;
      gap: 28px;
    }
    .auth-story {
      padding: 32px;
      min-height: 590px;
    }
    .auth-story h1 {
      font-size: 29px;
    }
    .auth-card {
      padding: 32px;
    }
    .art-caption {
      left: 166px;
    }
  }
</style>
