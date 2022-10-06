<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <form action="/" class="SearchForm">
      <van-search
        v-model="SearchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <SearchResult v-if="isResultShow" :SearchContent="SearchText" />
    <!-- 搜索联想功能 -->
    <SearchSuggestion
      v-else-if="SearchText"
      :SearchContent="SearchText"
      @search="onSearch"
    />
    <!-- 搜索历史记录 -->
    <SearchHistory
      v-else
      :searchHistory="searchHistories"
      @delHistory="delHistories"
      @search="onSearch"
      @DelAllhistory="delAllhistories"
    />
  </div>
</template>

<script>
import SearchSuggestion from './components/searchsuggestion.vue'
import SearchResult from './components/searchresult.vue'
import SearchHistory from './components/searchhistory.vue'
import { setItem, getItem } from '@/utils/Storage'

export default {
  name: 'Search',
  components: {
    SearchSuggestion,
    SearchResult,
    SearchHistory
  },
  data () {
    return {
      SearchText: '',
      // 控制搜索结果的显示
      isResultShow: false,
      // 搜索的历史结果
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []
    }
  },
  watch: {
    searchHistories (value) {
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
  methods: {
    onSearch (val) {
      // 点击搜索结果之后更改文本框内容
      this.SearchText = val
      // 将搜索结果添加到搜索历史记录数组中
      // 要求: 不能有重复历史记录, 最新的搜索结果排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        console.log(index)
        this.searchHistories.splice(index, 1)
      }
      // 将搜索结果插在数组最前
      this.searchHistories.unshift(val)
      // 搜索结果显示
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    },
    delHistories (index) {
      this.searchHistories.splice(index, 1)
    },
    delAllhistories () {
      this.searchHistories = []
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .SearchForm {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
