<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{ comment.aut_name }}</div>
      <van-button
        class="like-btn"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        :loading="CommentLoading"
        @click="CommentLike"
        >{{ comment.like_count > 0 ? comment.like_count : "赞" }}</van-button
      >
    </div>

    <div slot="label">
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{ comment.pubdate | relativeTime }}</span>
        <van-button class="reply-btn" round @click="$emit('reply-click', comment)">回复 {{ comment.reply_count }}</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, delCommentLike } from '@/api/comment'
export default {
  name: 'CommentItem',
  data () {
    return {
      CommentLoading: false
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  methods: {
    async CommentLike () {
      this.CommentLoading = true
      try {
        if (this.comment.is_liking) {
        // 点赞了-->取消点赞
          await delCommentLike(this.comment.com_id)
          this.$toast.success('取消点赞评论')
          // eslint-disable-next-line vue/no-mutating-props
          this.comment.like_count--
        } else {
        // 没点赞-->点赞
          await addCommentLike(this.comment.com_id)
          this.$toast.success('点赞评论成功')
          // eslint-disable-next-line vue/no-mutating-props
          this.comment.like_count++
        }
        // eslint-disable-next-line vue/no-mutating-props
        this.comment.is_liking = !this.comment.is_liking
      } catch (error) {
        if (error.response.status === 401) {
          this.$router.push('/login')
          this.$toast('请先登录!')
        } else {
          this.$toast('操作失败, 请稍后重试!')
        }
      }
      this.CommentLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    min-width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
  }
  .van-icon-good-job {
    color: #ff5f2b;
  }
}
</style>
