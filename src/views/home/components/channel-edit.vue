<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEditBtnShow = !isEditBtnShow"
        >{{ isEditBtnShow == false ? "编辑" : "完成" }}</van-button
      >
    </van-cell>
    <van-grid class="mygrid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(item, index) in myChanneList"
        :key="index"
        @click="onMychannelClick(item, index)"
      >
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEditBtnShow && !fixChannels.includes(item.id)"
        ></van-icon>
        <span
          class="text"
          slot="text"
          :class="index === myactive ? 'active' : ''"
          >{{ item.name }}</span
        >
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        icon="plus"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannels } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/Storage'
export default {
  name: 'ChannelEdit',
  props: ['myChanneList', 'myactive'],
  data () {
    return {
      AllChannels: [],
      // 控制删除按钮显示/隐藏
      isEditBtnShow: false,
      // 保留不能被删的频道
      fixChannels: [0]
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.AllChannels = data.data.channels
        // console.log(this.AllChannels)
      } catch (error) {
        console.log(error)
        this.$toast('获取频道失败, 请稍后重试')
      }
    },
    async onAddChannel (channel) {
      console.log(channel)
      // eslint-disable-next-line vue/no-mutating-props
      this.myChanneList.push(channel)
      // 数据持久化处理
      if (this.user) {
        try {
          // 登录情况下, 将数据存储到线上
          await addUserChannels({
            // 频道id
            id: channel.id,
            // 序号
            seq: this.myChanneList.length
          })
        } catch (error) {
          console.log(error)
          this.$toast('添加失败, 请重新添加')
        }
      } else {
        // 未登录, 将数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChanneList)
      }
    },
    async onMychannelClick (channel, index) {
      // 如果不在必须存在的频道, 那么就执行下列操作
      if (!this.fixChannels.includes(index)) {
        // 编辑状态, 执行删除频道
        if (this.isEditBtnShow) {
          // this.myChanneList.splice(index, 1)
          this.$emit('delMyChannel', index)
          if (!this.user) {
            // 未登录, 将删除完剩下的数据更新到本地
            setItem('TOUTIAO_CHANNELS', this.myChanneList)
          }
        } else {
          // 非编辑状态, 执行切换频道
          this.$emit('changeChannel', index)
        }
      }
    }
  },
  computed: {
    ...mapState(['user']),
    // eslint-disable-next-line vue/return-in-computed-property
    recommendChannels () {
      // eslint-disable-next-line no-unused-vars
      const channels = []
      this.AllChannels.forEach((channel) => {
        const ret = this.myChanneList.find((myChannel) => {
          return myChannel.id === channel.id
        })
        console.log(channel)
        // 如果myChannel不包含channel, 就代表是要到频道推荐里的
        if (!ret) {
          channels.push(channel)
        }
      })
      // 把计算结果返回
      return channels
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  ::v-deep .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      background-color: #f4f5f6;
      white-space: nowrap;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  ::v-deep .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
  ::v-deep .mygrid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        top: -13px;
        right: -13px;
        font-size: 38px;
        z-index: 5;
        color: #cacaca;
      }
    }
  }
}
</style>
