<template>
  <div v-if="friendLinkList" class="friend">
    <div class="friend_link">
      <div class="link_one">友情链接:</div>
      <div v-for="(item, index) in friendLinkList" :key="index">
        <a :href="item.linkUrl" :target="item.linkTarget">{{ item.linkName }}</a>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { indexApi } from '~/api/index.js'
  import { getStorage, setStorage } from '~/utils/storage.js'

  const friendLinkList = ref()
  onMounted(() => {
    friendLinkList.value = getStorage('WebsiteLink')
    if (!friendLinkList.value) {
      indexApi.websiteLink().then((res) => {
        setStorage('WebsiteLink', res, 60)
        friendLinkList.value = res
      })
    }
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

      div {
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
