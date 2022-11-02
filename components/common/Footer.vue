<template>
  <div class="i_footer">
    <div v-show="friendLinkList && friendLinkList.length" class="friend_link">
      <ul class="clearfix">
        <li class="link_one">友情链接:</li>
        <li v-for="(item, index) in friendLinkList" :key="index"><a :href="item.linkUrl" :target="item.linkTarget">{{ item.linkName }}</a></li>
      </ul>
    </div>
    <!-- <Bottom /> -->
  </div>
</template>
<script>
import { linkList } from '~/api/main.js'
// import Bottom from '@/components/common/Bottom'

export default {
  name: 'Footer',
  // components: { Bottom },
  data() {
    return {
      friendLinkList: []
    }
  },
  mounted() {
    linkList().then(res => {
      this.friendLinkList = res
    })
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.i_footer {
  background: rgb(51, 51, 51);
  padding-top: 10px;

  .friend_link {
    width: 1200px;
    margin: 0 auto;
    padding: 5px 0 10px;

    li {
      float: left;
      font-size: 14px;

      &.link_one {
        color: #fff;
        margin-right: 20px;
      }

      a {
        color: #ccc;
        margin: 0px 10px;

        &:hover {
          color: #fff;
          text-decoration: none;
        }
      }
    }
  }
}
</style>
