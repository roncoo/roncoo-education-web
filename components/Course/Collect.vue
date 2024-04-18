<template>
  <div class="collect" @click="handleCollect">
    <img v-if="!status" src="../../assets/svg/collect.svg" alt="收藏" />
    <img v-if="status" src="../../assets/svg/favorite.svg" alt="已收藏" />
    <span>收藏</span>
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
      if (res && res === 'add') {
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
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    float: right;
    margin-left: 20px;
    img {
      width: 20px;
    }
  }
</style>
