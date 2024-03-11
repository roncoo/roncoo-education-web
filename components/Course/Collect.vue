<template>
  <div class="collect" @click="handleCollect">
    <img :class="{ color: status }" src="@/assets/svg/collect.svg" alt="收藏" height="20px" />
    收藏
  </div>
</template>

<script setup>
  import { courseApi } from '~/api/course'

  const props = defineProps({
    courseId: {
      type: String,
      default: ''
    },
    collectStatus: {
      type: Boolean,
      default: false
    }
  })

  const { collectStatus } = toRefs(props)
  const status = ref(false)
  watch(
    collectStatus,
    (newValue) => {
      status.value = newValue
    },
    {
      immediate: true
    }
  )

  const handleCollect = () => {
    courseApi.courseCollectAdd({ courseId: props.courseId }).then((res) => {
      if (res === 'add') {
        status.value = true
        ElMessage.success('收藏成功')
      } else {
        status.value = false
        ElMessage.success('取消收藏')
      }
    })
  }
</script>

<style lang="scss" scoped>
  .collect {
    font-size: 14px;
    cursor: pointer;
    float: right;
    margin-left: 20px;
    img {
      vertical-align: middle;
      margin-top: -5px;
    }
  }

  .color {
    filter: drop-shadow(0px 0px 1px #70ff00);
  }
</style>
