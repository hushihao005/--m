<template>
    <van-button
      v-if="isfollowed"
      class="follow-btn"
      round
      size="small"
      :loading="followLoading"
      @click="onFollow"
      >已关注</van-button
    >
    <van-button
      v-else
      class="follow-btn"
      type="info"
      color="#3296fa"
      round
      size="small"
      icon="plus"
      :loading="followLoading"
      @click="onFollow"
      >关注</van-button
    >
</template>

<script>
import { addFollow, delFollow } from '@/api/user'
export default {
  name: 'followuser',
  data () {
    return {
      // 关注按钮loading状态
      followLoading: false
    }
  },
  props: {
    isfollowed: {
      type: Boolean,
      required: true
    },
    userid: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onFollow () {
      this.followLoading = true
      try {
        if (this.isfollowed) {
        // 关注了, 取消关注
          await delFollow(this.userid)
        } else {
        // 没关注, 添加关注
          await addFollow(this.userid)
        }
        this.$emit('IsFollowed')
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.$toast('不能关注自己')
        }
        if (error.response.status === 401) {
          this.$router.push('/login')
          this.$toast('请先登录')
        } else {
          this.$toast('操作失败, 请重试')
        }
      }
      this.followLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
