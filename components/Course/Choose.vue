<template>
  <div class="search_type_list">
    <div class="tag">
      <p>{{ changeNumToHan(index + 1) }}级分类：</p>
      <div class="item_box">
        <span v-for="(item, index) in menu.list" :key="index" class="search_type_item" :data-id="item.id" :class="{ active: map.key === item.id }" @click="handleClick(item)">
          {{ item.categoryName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { changeNumToHan } from '~/utils/base'

  const props = defineProps({
    menu: {
      type: Object,
      default: () => {
        return { active: '', list: [] }
      }
    },
    index: {
      type: Number,
      default: () => {
        return 0
      }
    }
  })
  const { menu, index } = toRefs(props)
  const map = reactive({
    key: ''
  })
  watch(
    menu,
    (val) => {
      if (val) {
        map.key = val.active
      }
    },
    { immediate: true }
  )
  const emit = defineEmits(['change'])
  const handleClick = (row) => {
    if (row.id !== map.key) {
      map.key = row.id
      emit('change', index.value, row)
    }
  }
</script>

<style scoped lang="scss">
  .search_type_list {
    display: flex;
    line-height: 20px;
    p {
      font-weight: bold;
    }
    .tag {
      display: flex;
      align-items: center;
      .item_box {
        flex: 1;
      }
    }

    .search_type_item {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: #333333;
      cursor: pointer;
      margin-right: 10px;
      padding: 5px 8px;
      &.not_right {
        margin-right: 0;
      }

      &.active {
        color: #3d7fff;
        font-weight: bold;
        background: rgba(61, 127, 255, 0.1);
        border-radius: 5px;
      }
    }
  }
</style>
