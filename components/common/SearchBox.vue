<template>
  <div class="fr search_box clearfix">
    <form action="" @submit="changeShow" class="clearfix">
      <button class="search_btn" @click="changeShow"><span class="iconfont">&#xe633;</span></button>
      <input type="text" v-model="searchStr" class="search_input" placeholder="请输入搜索内容">
    </form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        searchStr: ''
      }
    },
    methods: {
      changeShow (e) {
        e.preventDefault()
        console.log(this.searchStr)
        if (!this.searchStr) {
          this.$msgBox.showMsgBox({
            content: '请输入搜索内容',
            isShowCancelBtn: false
          }).catch(() => {})
          return
        }
        this.$router.push({name: 'search-str', params: {str: this.searchStr}})
      },
      closeSearch () {
        this.showBox = false
        this.searchStr = ''
      }
    }
  }
</script>
<style lang="scss" scoped>
  .search_box {
    width: 300px;
    margin: 35px 20px 0 0;
    form {
      float: right;
      background: #fff;
      width: 200px;
      border-bottom: 1px solid rgb(220, 220, 220);
    }
  }
  .search_input {
    height: 32px;
    line-height: 32px;
    width: 0px;
    font-size: 14px;
    color: #333;
    border: none;
    width: 165px;
  }
  .search_btn {
    float: right;
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    background: #fff;
    border: 0;
    font-size: #333;
    width: 35px;
    font-size: 14px;
    outline: none;
    .iconfont {
      font-size: 24px;
      color: #999;
    }
  }
</style>
