<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      @click-left="$emit('close')"
      right-text="完成"
      @click-right="updateName"
    ></van-nav-bar>

    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  data () {
    return {
      // 输入框内容
      localName: this.value
    }
  },
  props: {
    // 父组件通过v-model传来的值, 默认名称是value
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    async updateName () {
      this.$toast.loading({
        message: '修改中...',
        // 禁止背景点击
        forbidClick: true,
        // 持续展示
        duration: 0
      })
      try {
        if (this.localName === this.value) {
          this.$toast('请输入修改后的昵称')
        } else if (!this.localName.length) {
          this.$toast('请输入昵称')
          // eslint-disable-next-line no-useless-return
          return
        } else {
          const { data } = await updateUserProfile({
            name: this.localName
          })
          console.log(data)
          // 更新视图 通过v-model绑定父传子数据的, 可以通过触发input事件实现子传父
          this.$emit('input', this.localName)
          this.$toast.success('昵称更改成功')
          // 关闭弹层
          this.$emit('close')
        }
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.field-wrap {
  padding: 15px;
}
</style>
