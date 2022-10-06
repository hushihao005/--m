<template>
  <div class="home-container">
    <!-- 页面导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        v-for="(item, index) in userChannel"
        :title="item.name"
        :key="index"
      >
        <!-- 文章列表 -->
        <ArticleList :Channel="item"></ArticleList>
      </van-tab>
      <div slot="nav-right" class="placehold"></div>
      <div slot="nav-right" class="hamburger-btn" @click="isEditShow = true">
        <i class="iconfont toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isEditShow"
      closeable
      position="bottom"
      :style="{ height: '65%' }"
      close-icon-position="top-left"
    >
      <ChannelEdit
        :myChanneList="userChannel"
        :myactive="active"
        @changeChannel="updateChannel"
        @delMyChannel="updateEditChannel"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/Storage'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      userChannel: [],
      channels: [],
      // 控制编辑频道的显示状态
      isEditShow: false
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  created () {
    this.loadChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loadChannels () {
      try {
        let channels = []
        if (this.user) {
          // 已登录, 请求获取用户频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录, 判断是否有本地判断列表数据
          //    有, 就直接拿来使用
          //    没有, 获取后端默认频道数据
          const LocalChannels = getItem('TOUTIAO_CHANNELS')
          if (LocalChannels) {
            channels = LocalChannels
          } else {
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.userChannel = channels
      } catch (error) {
        this.$toast('获取列表信息失败,请稍后再试')
      }
    },
    updateChannel (index) {
      this.active = index
      this.isEditShow = false
    },
    updateEditChannel (index) {
      // 删除的频道是激活频道之前的频道
      if (index < this.active) {
        this.active--
      }
      this.userChannel.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  ::v-deep .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  ::v-deep .channel-tabs {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 0px;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .placehold {
      flex-shrink: 0;
      width: 46px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.iconfont {
        font-size: 33px;
      }
      &::before {
        content: "";
        width: 1.5px;
        height: 100%;
        position: absolute;
        left: 0;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
