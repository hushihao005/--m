<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="OnChange"
      :default-index="value"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  data () {
    return {
      columns: ['男', '女'],
      GenderIndex: this.value
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    OnChange (picker, value, index) {
      this.GenderIndex = index
    },
    async onConfirm (value) {
      this.$toast.loading({
        message: '修改中...',
        // 禁止背景点击
        forbidClick: true,
        // 持续展示
        duration: 0
      })
      try {
        const { data } = await updateUserProfile({
          gender: this.GenderIndex
        })
        console.log(data)
        // 更新视图 通过v-model绑定父传子数据的, 可以通过触发input事件实现子传父
        this.$emit('input', this.GenderIndex)
        this.$toast.success('修改成功')
        // 关闭弹层
        this.$emit('close')
      } catch (error) {
        this.$toast.fail('修改失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.update-gender {
  /deep/ .van-picker__cancel {
    color: #1989fa;
  }
  /deep/ .van-picker__confirm {
    color: #1989fa;
  }
}
</style>
