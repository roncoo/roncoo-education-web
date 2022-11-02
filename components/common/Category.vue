<!-- 轮播图上的分类 -->
<template>
  <div v-if="list.length" class="class_block" @mouseleave="hideWidth">
    <ul :class="{left_block: true, show_scroll: list.length > 10}">
      <li v-for="(item, index) in list" :key="index" :class="{active: item.id == categoryId}" :style="list.length >= 5 && list.length <= 10 &&'line-height:' + (height/list.length) + 'px;'" @mouseenter="changeWidth(item)">
        <nuxt-link :to="{name: 'list', query: {categoryId: item.id}}">{{ item.categoryName }}</nuxt-link>
        <span class="arrow" />
      </li>
    </ul>
    <div class="big_block clearfix" :style="'width:' + width + 'px;'">
      <div class="list_items fl clearfix">
        <div v-for="(item1, index1) in twoList" :key="index1" class="list_item clearfix">
          <nuxt-link :to="{name: 'list', query: {categoryId: categoryId, categoryTwoId: item1.id}}" :class="{class_header: true, fl: true}">{{ item1.categoryName }}</nuxt-link>
          <div class="fl three_box">
            <nuxt-link v-for="(item2, index2) in item1.list" :key="index2" :to="{name: 'list', query: {categoryId: categoryId, categoryTwoId: item1.id, categoryThreeId: item2.id}}" class="three_link">{{ item2.categoryName }}</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    height: {
      type: [String, Number],
      default() {
        return 200
      }
    },
    list: {
      type: [Array, Object],
      default() {
        return []
      }
    }
  },
  data() {
    return {
      width: 0,
      categoryId: '',
      twoList: []
    }
  },
  mounted() {
  },
  methods: {
    changeWidth(item) {
      this.width = 300
      this.categoryId = item.id
      this.twoList = item.list
    },
    hideWidth() {
      this.width = 0
      this.categoryId = ''
    }
  }
}
</script>
<style lang="scss" scoped>
a {
  &:hover {
    color: #D51423;
    text-decoration: none;
  }
}

.class_block {
  position: absolute;
  height: 100%;
  top: 0;
  left: 50%;
  z-index: 20;
  margin-left: -600px;
}

.left_block {
  border-radius: 10px;
  width: 200px;
  font-size: 14px;
  height: 100%;
  background: rgba(0, 0, 0, 0.67843137254902);

  &.show_scroll {
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: rgba(245, 245, 245, 0.4);
    }
  }

  .arrow {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-top: 1px solid #ccc;
    border-right: 1px solid #ccc;
    transform: rotate(45deg);
    position: absolute;
    right: 20px;
    top: 50%;
    margin-top: -3px;
  }

  li {
    line-height: 50px;
    padding: 0 20px;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.active {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 10px 0 0 10px;
      margin: 0px 8px;
      a {
        color: #D51423;
      }

      .arrow {
        border-color: #D51423;
      }
    }
  }

  a {
    color: #ccc;
    display: block;

    &:hover {
      color: #D51423;
    }
  }
}

.big_block {
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  margin-left: 90px;
  background: #fff;
  transition: width 0.1s;
  overflow: hidden;
  box-shadow: 1px 0px 1px rgba(0, 0, 0, 0.1);
}

.list_items {
  height: 100%;
  width: 300px;
  padding: 0 30px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(210, 210, 210, 0.4);
  }
}

.list_item {
  padding-top: 20px;
  position: relative;
  line-height: 20px;

  .class_header {
    padding-right: 20px;
    background: #fff;
    font-size: 14px;
    font-weight: 700;
    line-height: 30px;

    &.has_three {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 60px;
    }
  }

  .three_box {
    width: 300px;
  }

  .three_link {
    font-size: 14px;
    color: #999;
    display: inline-block;
    margin-right: 20px;

    &:hover {
      color: #D51423;
    }
  }
}

.foot_courses {
  padding: 0px 30px;
  height: 100%;
  width: 300px;
  background: rgba(247, 245, 248, 1);
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.1);
  }

  .courses_top {
    font-size: 14px;
    font-weight: 700;
    padding: 20px 0px;
  }

  .foot_course {
    width: 220px;
    position: relative;
    margin-bottom: 20px;
  }

  .inline_box {
    display: inline-block;
    height: 43px;
  }

  .img_box {
    width: 110px;
    height: 63px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
  }

  .course_info {
    font-size: 14px;
    margin-left: 8px;
  }

  .course_name {
    position: absolute;
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333;
    top: 0;

    &:hover {
      text-decoration: none;
      color: #D51423;
    }
  }

  .course_price {
    position: absolute;
    color: #999;
    bottom: 2px;
  }
}
</style>
