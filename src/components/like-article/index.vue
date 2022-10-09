<template>
  <van-icon
    color="#777"
    :name="attitude === 1 ? 'good-job' : 'good-job-o'"
    @click="LikeArticle"
    :loading="loading"
  />
</template>

<script>
import { likeCollect, delLikeCollect } from '@/api/article'
export default {
  name: 'likeArticle',
  data () {
    return {
      loading: false
    }
  },
  props: {
    attitude: {
      type: Number,
      required: true
    },
    articleID: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async LikeArticle () {
      this.loading = true
      try {
        // 发送给父组件 控制点赞/不点赞 1点赞 -1不点赞
        let status = -1
        if (this.attitude === 1) {
          // 取消点赞
          await delLikeCollect(this.articleID)
        } else {
          // 点赞
          await likeCollect(this.articleID)
          status = 1
        }
        this.$emit('changeAttitude', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (error) {
        this.$toast('操作失败, 请重试')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.van-icon-good-job {
  color: #ff5f2b !important;
}
</style>
