<!-- 基于 element-plus 的 el-pagination 简单封装，方便统一 -->
<template>
  <el-pagination
    v-show="props.total > 0"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="props.total"
    :background="true"
    :page-sizes="[20, 50, 100, 200]"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    // 总条目数
    total: {
      required: true,
      type: Number
    },
    // 当前页数
    currentPage: {
      type: Number,
      default: 1
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: 20
    }
  })

  const emit = defineEmits(['update:current-page', 'update:page-size', 'pagination'])
  const currentPage = computed({
    get() {
      return props.currentPage
    },
    set(val) {
      emit('update:current-page', val)
    }
  })
  const pageSize = computed({
    get() {
      return props.pageSize
    },
    set(val) {
      emit('update:page-size', val)
    }
  })
  const handleSizeChange = (val) => {
    if (currentPage.value * val > props.total) {
      currentPage.value = 1
    }
    emit('pagination', { currentPage: currentPage.value, pageSize: val })
  }
  const handleCurrentChange = (val) => {
    emit('pagination', { currentPage: val, pageSize: pageSize.value })
  }

  defineOptions({ name: 'Pagination' })
</script>
