<!-- 列表页分类 -->
<template>
  <div class="header_list">
    <div class="list_content">
      <ul class="content_ul clearfix">
        <li @click="changeOne([], -1, '')"><a href="javascript:">全部</a></li>
        <li v-for="(item, index) in classList" :key="index" :class="{now: oneNow == item.id}" @click="changeOne(item.list, index, item.id)"><a href="javascript:">{{ item.categoryName }}</a></li>
      </ul>
    </div>
    <div class="list_content">
      <ul class="content_ul clearfix">
        <li :class="{now: fourNow == 3}" @click="changeFour(3)"><a href="javascript:">全部</a></li>
        <li :class="{now: fourNow == 2}" @click="changeFour(2)"><a href="javascript:">付费</a></li>
        <li :class="{now: fourNow == 1}" @click="changeFour(1)"><a href="javascript:">免费</a></li>
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
    }
  },
  data() {
    return {
      fiveNow: '',
      categoryObj: {
        categoryId: '',
        isFree: ''
      }
    }
  },
  mounted() {
    if (this.$route.query.categoryno1 || this.$route.query.categoryno1 === '') {
      this.categoryObj.categoryNo1 = this.$route.query.categoryno1
    }
    if (this.$route.query.categoryno2 || this.$route.query.categoryno2 === '') {
      this.categoryObj.categoryNo2 = this.$route.query.categoryno2
    }
    if (this.$route.query.categoryno3 || this.$route.query.categoryno3 === '') {
      this.categoryObj.categoryNo3 = this.$route.query.categoryno3
    }
    if (this.$route.query.four) {
      this.fourNow1 = this.$route.query.four
    }
    if (this.$route.query.courseCategory) {
      this.fiveNow = this.$route.query.courseCategory
    } else {
      this.fiveNow = ''
    }
    this.getNextClass()
  },
  methods: {
    changeOne(twoList, oneNow, categoryNo1) {
      if (categoryNo1) {
        this.oneNow = categoryNo1
      } else {
        this.oneNow = 0
      }
      if (twoList) {
        this.twoList = twoList
      } else {
        this.twoList = []
      }
      this.categoryObj.categoryNo2 = ''
      this.categoryObj.categoryNo3 = ''
      this.twoNow = 0
      this.threeNow = 0
      this.threeList = []
      this.categoryObj.categoryNo1 = categoryNo1
      this.goCourseList()
    },
    changeTwo(threeList, twoNow, categoryNo2) {
      if (categoryNo2) {
        this.twoNow = categoryNo2
      } else {
        this.twoNow = 0
      }
      if (threeList) {
        this.threeList = threeList
      } else {
        this.threeList = []
      }
      this.categoryObj.categoryNo3 = ''
      this.threeNow = 0
      this.categoryObj.categoryNo2 = categoryNo2
      this.goCourseList()
    },
    changeThree(threeNow, categoryNo3) {
      if (categoryNo3) {
        this.threeNow = categoryNo3
      } else {
        this.threeNow = 0
      }
      this.categoryObj.categoryNo3 = categoryNo3
      this.goCourseList()
    },
    changeFour(fourNow) {
      this.fourNow1 = fourNow
      this.goCourseList()
    },
    changeFive(fiveNow) {
      this.fiveNow = fiveNow
      this.goCourseList()
    },
    goCourseList() {
      // const that = this
      const category = this.categoryObj
      this.$router.push({ name: 'list', query: { categoryId: category.id, four: this.fourNow1 }})
    },
    getNextClass() {
      if (this.$route.query.categoryno1) {
        for (let i = 0; i < this.classList.length; i++) {
          if (this.classList[i].id === this.$route.query.categoryno1) {
            this.oneNow = this.$route.query.categoryno1
            if (this.classList[i].twoList) {
              this.twoList = this.classList[i].twoList
              this.getThreeClass()
            }
          }
        }
      }
    },
    getThreeClass() {
      if (this.$route.query.categoryno2) {
        for (let i = 0; i < this.twoList.length; i++) {
          if (this.twoList[i].id === this.$route.query.categoryno2) {
            this.twoNow = this.$route.query.categoryno2
            if (this.twoList[i].threeList) {
              this.threeList = this.twoList[i].threeList
              if (this.$route.query.categoryno3) {
                this.threeNow = this.$route.query.categoryno3
              }
            }
          }
        }
      }
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
