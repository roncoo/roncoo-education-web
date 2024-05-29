<template>
  <el-row class="zone_body" :gutter="20">
    <el-col v-for="(course, int) in props.list" :key="int" :span="6" class="zone_body_course">
      <nuxt-link target="_blank" :to="{ name: 'course-detail', query: { id: course.id } }">
        <img :src="course.courseLogo" alt="" />
        <div class="course_name" v-html="course.courseName" />
        <div class="course_desc">
          <div v-if="course.coursePrice === 0" class="price_box">免费</div>
          <div v-else class="price_box">
            ￥{{ course.coursePrice }} <span style="text-decoration-line: line-through; font-size: 12px">￥{{ course.rulingPrice }}</span>
          </div>
          <div class="collect">
            <course-collect :course-id="course.id" />
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
  .zone_body {
    margin-top: 20px 0;
    overflow: hidden;
    .zone_body_course {
      float: left;
      width: 285px;
      height: 255px;
      border-radius: 6px;
      margin: 20px 0;

      &:nth-child(4n) {
        margin-right: 0px;
      }

      &:hover {
        box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
        transition: all 0.3s;
      }

      a {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        background: #fff;
        border-radius: 6px;

        &:hover {
          color: #000;
          text-decoration: none;
        }

        .course_name {
          font-size: 16px;
          margin-top: 5px;
          padding-left: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 25px;
          height: 50px;
        }

        .course_desc {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .price_box {
            font-size: 16px;
            margin-top: 5px;
            margin-left: 10px;
            color: red;
          }

          .collect {
            margin-right: 8px;
            font-size: 12px;
          }
        }
      }
    }
    img {
      width: 285px;
      height: 158px;
      border-radius: 6px 6px 0 0;
    }
  }
</style>
