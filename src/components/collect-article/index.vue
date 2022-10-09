<template>
  <van-icon
    :name="value === false ? 'star-o' : 'star'"
    @click="onCollect"
    :loading="loading"
  />
</template>

<script>
import { addCollect, delCollect } from '@/api/article'
export default {
  name: 'collectArticle',
  data () {
    return {
      loading: false
    }
  },
  props: {
    // 通过父组件v-model传来的值(跟父传子类似. 就是is_collected)
    value: {
      type: Boolean,
      required: true
    },
    articleID: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onCollect () {
      this.loading = true
      try {
        if (this.value) {
        // true代表已收藏 -> 取消收藏
          await delCollect(this.articleID)
        } else {
        // false代表没收藏 -> 添加收藏
          await addCollect(this.articleID)
        }
        // 用v-model传到props里的值需要修改时, 也是通过子传父, 但是事件是默认的input
        this.$emit('input', !this.value)
        // 这里取非是因为要提交父组件修改值, 但是这里父组件还没修改好就用了, 所以要取非
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (error) {
        this.$toast('操作失败, 请重试')
      }

      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.van-icon-star {
  color: #ffa500 !important;
}
</style>
