<!-- 列表页分类 -->
<template>
  <div class="header_list">
    <div class="list_content">
      <ul class="content_ul clearfix">
        <li :class="{now: oneNow == 0}" @click="changeOne([], -1, '')"><a href="javascript:">全部</a></li>
        <li :class="{now: oneNow == item.id}" v-for="(item, index) in classList" :key="index" @click="changeOne(item.twoList, index, item.id)"><a href="javascript:">{{item.categoryName}}</a></li>
      </ul>
    </div>
    <div class="list_content" v-if="twoList.length">
      <ul class="content_ul clearfix">
        <li :class="{now: twoNow == 0}" @click="changeTwo([], -1, '')"><a href="javascript:">全部</a></li>
        <li :class="{now: twoNow == two.id}" v-for="(two, index) in twoList" :key="index" @click="changeTwo(two.threeList, index, two.id)"><a href="javascript:">{{two.categoryName}}</a></li>
      </ul>
    </div>
    <div class="list_content" v-if="threeList.length">
      <ul class="content_ul clearfix">
        <li :class="{now: threeNow == 0}" @click="changeThree(-1, '')"><a href="javascript:">全部</a></li>
        <li :class="{now: threeNow == three.id}" @click="changeThree(index, three.id)" v-for="(three, index) in threeList" :key="index"><a href="javascript:">{{three.categoryName}}</a></li>
      </ul>
    </div>
    <div class="list_content">
      <ul class="content_ul clearfix">
        <li :class="{now: fourNow == 3}" @click="changeFour(3)"><a href="javascript:">全部</a></li>
        <li :class="{now: fourNow == 2}" @click="changeFour(2)"><a href="javascript:">付费</a></li>
        <li :class="{now: fourNow == 1}" @click="changeFour(1)"><a href="javascript:">免费</a></li>
        <li v-if="webInfo && webInfo.isEnableVip" :class="{now: fourNow == 4}" @click="changeFour(4)"><a href="javascript:">SVIP免费</a></li>
      </ul>
    </div>
    <div class="list_content" v-if="courseType === 'live'">
      <ul class="content_ul clearfix">
        <li :class="{now: fiveNow == ''}" @click="changeFive('')"><a href="javascript:">全部</a></li>
        <li :class="{now: fiveNow == 2}" @click="changeFive(2)"><a href="javascript:">直播</a></li>
        <li :class="{now: fiveNow == 3}" @click="changeFive(3)"><a href="javascript:">直播+录播</a></li>
      </ul>
    </div>
  </div>
</template>
<script>
import {courseClass} from '~/api/course.js'
export default {
  props: {
    fourNow: {
      default: 3
    },
    courseType: {
      default: 'course'
    },
    classList: {
      type: [Array, Object],
      default () {
        return []
      }
    }
  },
  data () {
    return {
      webInfo: this.$store.state.webInfo,
      twoList: [],
      threeList: [],
      oneNow: 0,
      twoNow: 0,
      threeNow: 0,
      fourNow1: 3,
      fiveNow: '',
      categoryObj: {
        categoryNo1: '',
        categoryNo2: '',
        categoryNo3: '',
        isFree: ''
      }
    }
  },
  methods: {
    changeOne (twoList, oneNow, categoryNo1) {
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
    changeTwo (threeList, twoNow, categoryNo2) {
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
    changeThree (threeNow, categoryNo3) {
      if (categoryNo3) {
        this.threeNow = categoryNo3
      } else {
        this.threeNow = 0
      }
      this.categoryObj.categoryNo3 = categoryNo3
      this.goCourseList()
    },
    changeFour (fourNow) {
      this.fourNow1 = fourNow
      this.goCourseList()
    },
    changeFive (fiveNow) {
      this.fiveNow = fiveNow
      this.goCourseList()
    },
    goCourseList () {
      let that = this
      let categoryObj1 = this.categoryObj
      if (this.courseType === 'course') {
        this.$router.push({name: 'list', query: {categoryno1: categoryObj1.categoryNo1, categoryno2: categoryObj1.categoryNo2, categoryno3: categoryObj1.categoryNo3, four: that.fourNow1}})
      } else if (this.courseType === 'live') {
        this.$router.push({name: 'live', query: {categoryno1: categoryObj1.categoryNo1, categoryno2: categoryObj1.categoryNo2, categoryno3: categoryObj1.categoryNo3, four: that.fourNow1, courseCategory: that.fiveNow}})
      }
    },
    getCourseClass () {
      courseClass({
        categoryType: 5,
        orgNo: this.clientData.no
      }).then(res => {
        if (res.code === 200 && res.data.list.length > 0) {
          this.classList = res.data.list
          this.getNextClass()
        } else {
          this.classList = []
        }
      }).catch(msg => {
        console.log(msg)
      })
    },
    getNextClass () {
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
    getThreeClass () {
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
  },
  mounted () {
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
