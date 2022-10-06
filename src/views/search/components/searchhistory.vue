<template>
  <div class="Search-History">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="delAllhistory">全部删除</span>
        &nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistory"
      :key="index"
      :title="item"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon name="close" v-show="isDeleteShow"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  data () {
    return {
      // 控制删除的显示
      isDeleteShow: false
    }
  },
  props: {
    searchHistory: {
      type: Array,
      required: true
    }
  },
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态下的操作
        this.$emit('delHistory', index)
      } else {
        // 非删除状态下的操作
        this.$emit('search', item)
      }
    },
    delAllhistory () {
      this.$emit('DelAllhistory')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
