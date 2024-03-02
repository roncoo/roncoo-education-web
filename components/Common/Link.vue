<template>
  <div v-if="friendLinkList" class="friend">
    <ul class="friend_link">
      <li class="link_one">友情链接:</li>
      <li v-for="(item, index) in friendLinkList" :key="index">
        <a :href="item.linkUrl" :target="item.linkTarget">{{ item.linkName }}</a>
      </li>
    </ul>
  </div>
</template>
<script setup>
  import { indexApi } from '~/api/index.js'

  const friendLinkList = ref()
  onMounted(() => {
    indexApi.websiteLink().then((res) => {
      friendLinkList.value = res
    })
  })
</script>
<style lang="scss" scoped>
  .friend {
    clear: both;
    background-color: rgb(51, 51, 51);
    height: 30px;
    width: 100%;

    .friend_link {
      width: 1200px;
      margin: 0 auto;
      padding: 10px 0 0;

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
