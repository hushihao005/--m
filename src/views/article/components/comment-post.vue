<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button class="post-btn" @click="PostComment" :disabled = "!message.length">发布</van-button>
  </div>
</template>

<script>
import { CommentPost } from '@/api/comment'
export default {
  name: 'CommentPost',
  components: {},
  data () {
    return {
      // 文章输入内容
      message: ''
    }
  },
  // 用来接收provide传来的数据
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  props: {
    // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
    target: {
      type: [String, Object, Number],
      required: true
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async PostComment () {
      this.$toast.loading({
        message: '发表中...',
        // 禁用背景点击
        forbidClick: true,
        duration: 0 // 默认是2000,如果为0就持续显示
      })
      try {
        const { data } = await CommentPost({
        // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          target: this.target.toString(),
          // 评论内容
          content: this.message,
          // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。
          // 对文章进行评论，不要传此参数。
          art_id: this.articleId ? this.articleId.toString() : this.articleId
        })
        console.log(data)
        // 关闭弹出层
        // 将发布的内容显示到列表顶部
        this.$emit('post-success', data.data)
        // 清空文本框
        this.message = ''
        this.$toast.success('发表评论成功')
      } catch (error) {
        if (error.response.status === 401) {
          this.$router.push('/login')
          this.$toast('请先登录!')
        } else {
          this.$toast.fail('发表评论失败, 请重试!')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
