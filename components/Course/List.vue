<template>
  <div class="zone_body">
    <div v-for="(that, int) in props.list" :key="int">
      <nuxt-link target="_blank" :to="{ name: 'course-detail', query: { id: that.id } }">
        <img :src="that.courseLogo" alt="" />
        <p>{{ that.courseName }}</p>
        <span v-if="that.coursePrice === 0" class="price_box">免费</span>
        <span v-else class="price_box">
          ￥{{ that.coursePrice }} <span style="text-decoration-line: line-through; font-size: 12px">￥{{ that.rulingPrice }}</span>
        </span>
      </nuxt-link>
    </div>
  </div>
</template>
<script setup>
  const props = defineProps({
    list: {
      type: Array,
      default: () => []
    }
  })
</script>
<style lang="scss" scoped>
  .zone_body {
    margin-top: 25px;

    div {
      float: left;
      width: 285px;
      height: 222px;
      border-radius: 6px;
      margin: 0px 20px 20px 0px;

      &:nth-child(4n) {
        margin-right: 0px;
      }

      &:hover {
        box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
        transition: all 0.3s;
      }

      a {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        background: #fff;
        border-radius: 6px;

        &:hover {
          color: #000;
          text-decoration: none;
        }

        p {
          font-size: 16px;
          margin-top: 5px;
          padding-left: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
        }

        .price_box {
          font-size: 16px;
          position: absolute;
          bottom: 10px;
          left: 10px;
          color: red;
        }
      }
    }
    img {
      width: 285px;
      height: 158px;
      border-radius: 6px 6px 0 0;
    }
  }
</style>
