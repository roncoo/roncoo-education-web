<template>
  <div class="banner">
    <div :style="'height:366px;'" @mouseout="change" @mouseover="mover">
      <div v-for="(item, index) in data" :key="index" class="item" :style="'background-image: url(' + item.carouselImg + ');'" :class="{ on: index === num }">
        <a :href="item.carouselUrl" :title="item.carouselTitle" :target="item.carouselTarget" />
      </div>
    </div>
    <div class="page_dots">
      <span v-for="(item, index) in data" :key="index" class="dots" :class="{ on: index === num }" @mouseenter="num = index" />
    </div>
    <zone-category />
  </div>
</template>
<script setup>
  import { indexApi } from '~/api/index.js'

  // 轮播
  const data = ref()
  const num = ref(0)

  onMounted(async () => {
    data.value = await indexApi.carouselList()
    change()
  })

  let interval = null
  function change() {
    interval = setInterval(() => {
      if (data.value != undefined && num.value + 1 >= data.value.length) {
        num.value = 0
      } else {
        num.value++
      }
    }, 3000)
  }

  function mover() {
    clearInterval(interval)
  }
</script>
<style lang="scss" scoped>
  .banner {
    position: relative;
    width: 1200px;
    margin: 20px auto;

    .item {
      opacity: 0;
      height: 100%;
      background-position: center center;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9;
      transition: all 1s;
      border-radius: 10px;

      &.on {
        opacity: 1;
        z-index: 10;
      }

      a {
        width: 100%;
        height: 100%;
        display: block;
      }
    }

    .page_dots {
      position: absolute;
      bottom: 20px;
      right: 50%;
      margin-right: -580px;
      text-align: center;
      height: 0;
      z-index: 11;

      &.old {
        left: 0;
        right: 0;
        margin-right: 0;
        bottom: 30px;
      }

      .dots {
        display: inline-block;
        height: 8px;
        background: rgba(255, 255, 255, 0.3);
        margin: 0 1px;
        color: #fff;
        font-size: 14px;
        margin: 0 4px;
        width: 30px;

        &.old_dot {
          line-height: 30px;
          height: 30px;
          margin: 0 1px;
        }

        &.on {
          background-color: rgba(255, 255, 255, 0.8);
          color: #333;
        }
      }
    }
  }
</style>
