<template>
  <el-row class="lecturer-body" :gutter="20" style="margin: 0">
    <el-col v-for="(item, index) in props.list" :key="index" :span="8">
      <nuxt-link target="_blank" :to="{ name: 'lecturer-detail', query: { id: item.id } }">
        <div class="body-item">
          <img :src="item.lecturerHead" :alt="item.lecturerName" />
          <div class="item-info">
            <div>{{ item.lecturerName }}</div>
            <div>{{ item.lecturerPosition }}</div>
          </div>
        </div>
      </nuxt-link>
    </el-col>
  </el-row>
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
  .lecturer-body {
    padding: 20px 0;
    .body-item {
      background: #fff;
      border: 1px solid #ebeef5;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
      .item-info {
        margin-left: 20px;
        font-size: 14px;
        line-height: 35px;
      }
      &:hover {
        box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
        transition: all 0.3s;
      }
    }
  }
</style>
