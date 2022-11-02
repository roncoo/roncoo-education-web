<!-- 列表页分类 -->
<template>
  <div class="header_list">
    <div class="list_content">
      <ul class="content_ul clearfix">
        <li :class="{now: categoryId == ''}" @click="changeOne({id:''}, 0)"><a href="javascript:">全部</a></li>
        <li v-for="(item, index) in classList" :key="index" :class="{now: categoryOneId == item.id}" @click="changeOne(item, currentId)"><a href="javascript:">{{ item.categoryName }}</a></li>
      </ul>
    </div>
    <div v-if="twoList.length" class="list_content">
      <ul class="content_ul clearfix">
        <li :class="{now: categoryId == categoryOneId}" @click="changeTwo({id:categoryOneId}, 0)"><a href="javascript:">全部</a></li>
        <li v-for="(two, index) in twoList" :key="index" :class="{now: categoryTwoId == two.id}" @click="changeTwo(two, currentId)"><a href="javascript:">{{ two.categoryName }}</a></li>
      </ul>
    </div>
    <div v-if="threeList.length" class="list_content">
      <ul class="content_ul clearfix">
        <li :class="{now: categoryId == categoryTwoId}" @click="changeThree({id:categoryTwoId}, 0)"><a href="javascript:">全部</a></li>
        <li v-for="(three, index) in threeList" :key="index" :class="{now: categoryThreeId == three.id}" @click="changeThree(three, currentId)"><a href="javascript:">{{ three.categoryName }}</a></li>
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
      categoryId: '',
      categoryOneId: '',
      categoryTwoId: '',
      categoryThreeId: '',
      isFree: -1,
      twoList: [],
      threeList: []
    }
  },
  mounted() {
    // this.categoryId = this.currentId
    this.getNextClass()
  },
  methods: {
    getNextClass() {
      if (this.$route.query.categoryId) {
        for (let i = 0; i < this.classList.length; i++) {
          if (this.classList[i].id === this.$route.query.categoryId) {
            this.categoryOneId = this.$route.query.categoryId
            this.categoryId = this.$route.query.categoryId
            if (this.classList[i].list) {
              this.twoList = this.classList[i].list
              this.getThreeClass()
            }
          }
        }
      }
    },
    getThreeClass() {
      if (this.$route.query.categoryTwoId) {
        for (let i = 0; i < this.twoList.length; i++) {
          if (this.twoList[i].id === this.$route.query.categoryTwoId) {
            this.categoryTwoId = this.$route.query.categoryTwoId
            this.categoryId = this.$route.query.categoryTwoId
            if (this.twoList[i].list) {
              this.threeList = this.twoList[i].list || []
              if (this.$route.query.categoryThreeId) {
                this.categoryThreeId = this.$route.query.categoryThreeId
                this.categoryId = this.$route.query.categoryThreeId
              }
            }
          }
        }
      }
    },
    changeOne(data, currentId) {
      console.log('data', data)
      if (data.list && data.list.length) {
        this.twoList = data.list
      } else {
        // this.categoryOneId = ''
        this.twoList = []
      }
      this.categoryOneId = data.id
      this.categoryId = data.id
      this.categoryTwoId = ''
      this.categoryThreeId = ''
      this.threeList = []
      this.goCourseList()
    },
    changeTwo(data, currentId) {
      console.log('data', data)
      if (data.list && data.list.length) {
        this.threeList = data.list
      } else {
        // this.categoryTwoId = ''
        this.threeList = []
      }
      this.categoryTwoId = data.id
      this.categoryId = data.id
      this.goCourseList()
    },
    changeThree(data, currentId) {
      console.log('data', data)
      this.categoryId = data.id
      this.categoryThreeId = data.id
      this.goCourseList()
    },
    changeFree(index) {
      this.isFree = index
      this.goCourseList()
    },
    goCourseList() {
      const categoryId = this.categoryId
      const categoryTwoId = this.categoryTwoId
      const categoryThreeId = this.categoryThreeId
      const isFree = this.isFree
      const p = {
        path: this.$route.path,
        query: {
          categoryId,
          categoryTwoId,
          categoryThreeId,
          isFree
        }
      }
      if (!categoryId) {
        delete p.query.categoryId
      }
      if (!categoryTwoId) {
        delete p.query.categoryTwoId
      }
      if (!categoryThreeId) {
        delete p.query.categoryThreeId
      }
      if (isFree === -1) {
        delete p.query.isFree
      }
      console.log(p)
      // if (this.courseType === 'course') {
      this.$router.push(p)
      // }
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.header_list {
  border-top: 1px solid rgb(215, 215, 215);
  background: #f6f8fb;

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
