<!-- 列表页分类 -->
<template>
  <div class="header_list">
    <div class="list_content">
      <ul class="content_ul clearfix">
        <li :class="{now: categoryId == 0}" @click="changeOne({id:0}, 0)"><a href="javascript:">全部</a></li>
        <li v-for="(item, index) in classList" :key="index" :class="{now: categoryId == item.id}" @click="changeOne(item, currentId)"><a href="javascript:">{{ item.categoryName }}</a></li>
      </ul>
    </div>
    <div class="list_content">
      <ul class="content_ul clearfix">
        <li :class="{now: isFree == -1}" @click="changeFree(-1)"><a href="javascript:">全部</a></li>
        <li :class="{now: isFree == 0}" @click="changeFree(0)"><a href="javascript:">付费</a></li>
        <li :class="{now: isFree == 1}" @click="changeFree(1)"><a href="javascript:">免费</a></li>
      </ul>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    classList: {
      type: [Array, Object],
      default() {
        return []
      }
    },
    currentId: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      categoryId: 0,
      isFree: -1
    }
  },
  mounted() {
    // this.categoryId = currentId
  },
  methods: {
    changeOne(data, currentId) {
      this.categoryId = data.id
      this.goCourseList()
    },
    changeFree(index) {
      this.isFree = index
      this.goCourseList()
    },
    goCourseList() {
      // this.$router.push({ name: 'list', query: { categoryId: this.categoryId, isFree: this.isFree }})
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.header_list {
  border-top: 1px solid rgb(215, 215, 215);
  background: #fff;

  .list_content {
    width: 1200px;
    margin: 0 auto;
    height: 73px;
    border-bottom: 1px solid rgb(215, 215, 215);
    position: relative;

    &:last-child {
      border-bottom: none;
    }

    span {
      position: absolute;
      display: inline-block;
      font-size: 14px;
      font-weight: bold;
      height: 26px;
      line-height: 26px;
      top: 23px;
    }
  }
}

.content_ul {
  display: inline-block;
  // margin-left: 60px;
  margin-top: 23px;

  li {
    float: left;
    font-size: 14px;
    height: 26px;
    line-height: 26px;
    padding: 0 6px;
    border-radius: 6px;
    margin: 0 6px;

    a:hover {
      color: red;
      text-decoration: none;
    }

    &.now {
      background: rgb(51, 51, 51);

      a {
        color: #fff;
      }
    }
  }
}
</style>
