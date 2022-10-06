<template>
  <div class="Search-Suggestion">
    <van-cell
      icon="search"
      v-for="(item, index) in suggestions"
      :key="index"
      @click="ToResult(item)"
    >
      <div slot="title" v-html="highlight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { GetSearchSuggestions } from '@/api/search'
// 按需加载lodash里的方法
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  data () {
    return {
      // 联想建议数据列表
      suggestions: []
    }
  },
  props: {
    // 父组件传来的输入框里的数据
    SearchContent: {
      type: String,
      required: true
    }
  },
  watch: {
    SearchContent: {
      // 当SearchContent发生变化时就会调用
      // *handel函数名称是固定的, 语法要求
      // 利用lodash里的debounce函数进行防抖
      // debounce函数, 参数1: 一个处理函数, 参数2: 延迟时间 从输入完成后算起
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
      // 设置为true之后, 该函数会在侦听开始之后被立即调用
      immediate: true
    }
  },
  methods: {
    async loadSearchSuggestions (value) {
      try {
        console.log(value)
        const { data } = await GetSearchSuggestions(value)
        this.suggestions = data.data.options
        console.log(this.suggestions)
      } catch (error) {
        this.$toast('数据获取失败, 请稍后重试')
      }
    },
    highlight (item) {
      // 1.方法一 通过正则表达式匹配字段 然后使用replace方法替换匹配到的字段
      // const highlightStr = `<span class = "light">${this.SearchContent}</span>`
      // // 如果需要正则表达式根据数据动态变化的话, 要手动new RegExp
      // // RegExp 正则表达式构造函数, 参数一是要匹配的字符串, 参数二是匹配的模式
      // // gi代表模式 匹配全部 不区分大小写
      // const reg = new RegExp(this.SearchContent, 'gi')
      // replace方法, 参数一是要替换的字段, 参数二是要替换成的字段
      // return item.replace(reg, highlightStr)

      console.log(item)
      // // 2.方法二 通过split方法按照输入的字符进行分割 之后再通过join将输入的字符串进行拼接
      const highlightStr = (item || ' ').split(this.SearchContent)
      // // // console.log(highlightStr)
      // // // console.log(highlightStr.join(`<span class = "light">${this.SearchContent}</span>`))
      return highlightStr.join(`<span class = "light">${this.SearchContent}</span>`)
    },
    ToResult (item) {
      this.$emit('search', item)
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ span.light{
    color: red;
  }
</style>
