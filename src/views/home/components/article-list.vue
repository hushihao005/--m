<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="refreshText"
      :success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="获取失败，点击重新加载"
        @load="onLoad"
      >
        <!-- <van-cell
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
        /> -->
        <ArticleItem
          v-for="(item, index) in list"
          :key="index"
          :article="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item/index.vue'
export default {
  name: 'Articleist',
  data () {
    return {
      // 存储列表数据
      list: [],
      // 控制加载中loading显示状态
      loading: false,
      // 控制加载中结束的显示状态
      finished: false,
      // 请求获取下一页的页码
      timestamp: null,
      // 将 error 设置成 true 即可显示错误提示，用户点击错误提示后会重新触发 load 事件。
      error: false,
      // 控制下拉刷新的loading状态
      isLoading: false,
      refreshText: '刷新成功'
    }
  },
  components: {
    ArticleItem
  },
  props: {
    Channel: {
      type: Object,
      require: true
    }
  },
  methods: {
    // 1.请求获取的数据
    async onLoad () {
      try {
        const { data } = await getArticles({
          // 频道id
          channel_id: this.Channel.id,
          // 可以理解为页码
          timestamp: this.timestamp || Date.now()
        })
        // console.log(data)
        // 2.把后端传来的数据放到list数据中
        const { results } = data.data
        // ...results 数组展开操作符,会把数组元素一个个拿出来
        this.list.push(...results)
        console.log(this.list)
        // 3. 加载完之后将加载状态改为结束
        this.loading = false
        // 4.判断数据是否全部加载完成
        if (results.length) {
          // console.log(results.length)
          // 获取下一页的页码
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        // this.$toast('获取失败,请稍后再试')
        this.error = true
        this.loading = false
      }
    },
    // 下拉刷新的时候触发该函数
    async onRefresh () {
      // 1. 请求获取数据
      try {
        const { data } = await getArticles({
          // 频道id
          channel_id: this.Channel.id,
          // 下拉刷新,每次请求获取最新数据
          timestamp: Date.now()
        })
        // // 模拟失败
        // if (Math.random() >= 0.5) {
        //   JSON.parse('ejufeikfe')
        // }
        // 2. 将获取到的数据追加到列表顶部
        this.list.unshift(...data.data.results)
        // 刷新成功提示
        this.refreshText =
          '刷新成功, 增加了' + data.data.results.length + '条内容'
        // 3. 关闭下拉刷新的loading状态
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        this.refreshText = '刷新失败, 请重试'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  height: 85vh;
  overflow-y: auto;
}
</style>
