<template>
  <div class="Search-Result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync = "error"
      error-text="加载失败, 请点击重试"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { GetSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      // 数组列表
      list: [],
      // 加载状态
      loading: false,
      // 加载进度
      finished: false,
      // 页数
      page: 1,
      // 每页展示多少条
      perpage: 20,
      error: false
    }
  },
  props: {
    SearchContent: {
      type: String,
      required: true
    }
  },
  methods: {
    async onLoad () {
      try {
        // 1.请求获取数据
        const { data } = await GetSearchResult({
          page: this.page,
          per_page: this.perpage,
          q: this.SearchContent
        })
        console.log(data)
        // 2.将获取到的数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)
        console.log(this.list)
        // 3.将加载状态关闭
        this.loading = false
        // 4.判断是否还有数据
        //   如果有 那就继续加载下一个数据的页码
        //   如果没有 就将加载进度设为true 关闭
        if (results.length) {
          // console.log(results.length)
          this.page++
        } else {
          this.finished = true
        }
      } catch (error) {
        // 控制加载失败的提示显示
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
