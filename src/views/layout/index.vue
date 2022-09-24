<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <router-view />
    <!-- 底部标签导航栏 -->
    <van-tabbar  class="layout-tabber" route>
      <van-tabbar-item to="/home">
        <i slot="icon" class="iconfont toutiao-shouye"></i>
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/quest">
        <i slot="icon" class="iconfont toutiao-wenda"></i>
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <i slot="icon" class="iconfont toutiao-shipin"></i>
        <span class="text">视频</span>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <i slot="icon" class="iconfont toutiao-wode"></i>
        <span v-if="user" class="text">我的</span>
        <span v-else class="text">未登录</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'layout',
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.layout-container {
  .layout-tabber {
    i.iconfont {
      font-size: 40px;
    }
    span.text{
      font-size: 20px;
    }
  }
}
</style>
