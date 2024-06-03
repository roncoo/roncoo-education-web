<template>
  <div class="banner">
    <zone-category />
    <div class="carousel">
      <el-carousel height="360px">
        <el-carousel-item v-for="(item, index) in carouselList" :key="index">
          <a :href="item.carouselUrl" :title="item.carouselTitle" :target="item.carouselTarget">
            <img :src="item.carouselImg" alt="item.carouselTitle" />
          </a>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script setup>
  import { indexApi } from '~/api/index.js'
  // 轮播
  const carouselList = ref()
  onMounted(async () => {
    carouselList.value = await indexApi.carouselList()
  })
</script>
<style lang="scss" scoped>
  .banner {
    position: relative;
    width: 1200px;
    margin: 20px auto;
    display: flex;
    justify-content: space-between;
    .carousel {
      width: 100%;
      margin-left: 200px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 0 10px 10px 0;
      }
    }
  }
</style>
