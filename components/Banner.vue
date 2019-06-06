<template>
  <div class="banner">
    <ul :style="'height:'+ height+ 'px;'" @mouseout="mout" @mouseover="mover">
      <li class="item" v-for="(item, index) in data" :key="index" :style="'background-image: url('+item.advImg+');'" :class="{on:index === num}">
        <a :href="item.advUrl" :title="item.advTitle" :target="item.advTarget"></a>
      </li>
    </ul>
    <ul class="page_dots">
      <span class="dots" v-for="(item, index) in data" :class="{on:index === num}" @mouseenter="num = index" :key="index"></span>
    </ul>
    <y-class-block :height="height" :classList="classList" />
  </div>
</template>
<script>
import YClassBlock from './ClassBlock'
// import {mapState} from 'vuex'
export default {
  props: {
    data: {
      // 手机号
      type: [Object, Array],
      default: null
    },
    classList: {
      type: [Object, Array],
      default () {
        return []
      }
    },
    height: {
      type: [String, Number],
      default: 456
    }
  },
  data () {
    return {
      webInfo: this.$store.state.webInfo,
      num: 0,
      interval: null
    }
  },
  methods: {
    change () {
      this.interval = setInterval(() => {
        if (this.num + 1 >= this.data.length) {
          this.num = 0;
        } else {
          this.num++;
        }
      }, 3000)
    },
    mout () {
      this.change();
    },
    mover () {
      clearInterval(this.interval);
    }
  },
  mounted () {
    // console.log(this.data)
    this.change();
  },
  components: {
    YClassBlock
  }
}
</script>
<style lang="scss" scoped>
.banner{
  position: relative;
  ul{
    position: relative;
  }
  .item{
    opacity: 0;
    height: 100%;
    background-position: center center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    transition: all 1s;
    &.on{
      opacity: 1;
      z-index: 10;
    }
    a{
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .page_dots{
    position: absolute;
    bottom: 20px;
    right: 50%;
    margin-right: -600px;
    text-align: center;
    height: 0;
    z-index: 11;
    &.old {
      left: 0;
      right: 0;
      margin-right: 0;
      bottom: 30px;
    }
    .dots{
      display: inline-block;
      height: 8px;
      background: rgba(255, 255, 255, 0.3);
      margin: 0 1px;
      color: #fff;
      font-size: 14px;
      margin: 0 4px;
      width: 30px;
      &.old_dot {
        line-height: 30px;
        height: 30px;
        margin: 0 1px;
      }
      &.on{
        background-color: rgba(255, 255, 255, 0.8);
        color: #333;
      }
    }
  }
}
</style>
