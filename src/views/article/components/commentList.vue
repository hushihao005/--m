<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error="error"
    error-text="加载失败, 请稍后重试"
    @load="onLoad"
    :immediate-check = false
  >
    <commentItem  v-for="(item, index) in list" :key="index" :comment="item" @reply-click="$emit('reply-click', $event)" />
  </van-list>
</template>

<script>
import { getComment } from '@/api/comment'
import CommentItem from './comment-item.vue'
export default {
  name: 'commentList',
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      // 获取下一页数据的标记
      offset: null,
      limit: 10,
      error: false
    }
  },
  props: {
    commentID: {
      type: [String, Number, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    typeComment: {
      type: String,
      // prop数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  components: {
    CommentItem
  },
  created () {
    // 手动初始调用onload 不会出现loading动画
    // 所以要手动开启初始loading
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad () {
      try {
        // 获取文章评论和获取评论回复用的接口是一样的, 区别是传参的区别
        // 1.请求获取数据
        const { data } = await getComment({
          // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          type: this.typeComment,
          // 文章id或评论id
          source: this.commentID.toString(),
          // 页码
          offset: this.offset,
          // 获取评论的个数
          limit: this.limit
        })
        console.log(data)
        // 2.将数据添加到列表中
        const { results } = data.data
        // eslint-disable-next-line vue/no-mutating-props
        this.list.push(...results)
        // console.log(this.list)
        this.$emit('getTotalData', data.data)
        // console.log(data.data)
        // 3.将loading设置为false
        this.loading = false
        // 4.判断是不是还有数据
        //   有就更新页码,获取下一页的数据页码
        //   没有就将finish设置结束
        if (data.data.last_id) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (error) {
        console.log(error)
        this.loading = false
        this.error = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
