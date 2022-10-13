<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
    >
      <van-icon slot="left" name="cross" @click="$emit('click-close')" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <CommentItem :comment="comment"></CommentItem>
      <!-- /当前评论项 -->

      <van-cell title="全部回复" />

      <!-- 评论的回复列表 -->
      <commentList
        :commentID="comment.com_id"
        :typeComment="typeC"
        :list="commentList"
      ></commentList>
      <!-- /评论的回复列表 -->
    </div>

    <!-- 底部区域 -->
    <div class="post-wrap">
      <van-button class="post-btn" size="small" round @click="isPostShow = true">写评论</van-button>
    </div>

    <!-- 发表评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <CommentPost :target="comment.com_id" @post-success = "OnPostSuccess"></CommentPost>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import commentList from './commentList.vue'
import CommentPost from './comment-post.vue'
export default {
  name: 'commentReply',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      typeC: 'c',
      isPostShow: false,
      commentList: []
    }
  },
  components: {
    CommentItem,
    commentList,
    CommentPost
  },
  methods: {
    OnPostSuccess (data) {
      console.log(data)
      // 更新回复的数量
      // eslint-disable-next-line vue/no-mutating-props
      this.comment.reply_count++
      // 关闭弹层
      this.isPostShow = false
      // 将最新的回复展示到列表顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  height: 88px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
