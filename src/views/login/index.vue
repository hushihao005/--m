<template>
  <div class="login-container">
    <!-- 页面导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录" />
    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        type="number"
        :rules="userFormRules.mobile"
        maxlength="11"
      >
        <i slot="left-icon" class="iconfont toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        type="number"
        :rules="userFormRules.code"
        maxlength="6"
      >
        <i slot="left-icon" class="iconfont toutiao-yanzhengma"></i>
        <template #button>
          <!-- time是倒计时时间 -->
          <van-count-down
            :time="time"
            format="ss 秒"
            v-if="isShowCountDown"
            @finish="isShowCountDown = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="small"
            type="default"
            native-type="button"
            @click="onSendSms"
            >获取验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { login, sendSms } from '@/api/user'
export default {
  data () {
    return {
      isShowCountDown: false,
      time: 1000 * 60,
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          // 手机号必填项 不能为空
          { required: true, message: '手机号不能为空' },
          // 手机号格式正确
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误请重新输入' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          // 密码格式正确
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      // 1.获取表单数据
      const user = this.user
      // console.log(user)
      // 2.表单验证
      // 在组件中必须通过 this.$toast来调用Toast组件
      this.$toast.loading({
        message: '登录中...',
        // 禁用背景点击
        forbidClick: true,
        duration: 0 // 默认是2000,如果为0就持续显示
      })
      // 3.提交表单请求登录
      try {
        const { data } = await login(user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        // console.log(data)
      } catch (error) {
        if (error.response.status === 400) {
          this.$toast.fail('手机或验证码错误!')
          this.user.mobile = ''
          this.user.code = ''
        } else {
          this.$toast.fail('登录失败,请稍后再试')
        }
      }
      // 4.根据后端返回的结果进行后续操作
    },

    async onSendSms () {
      // 1.校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
        // 2.验证通过,显示倒计时
        console.log('验证通过')
        this.isShowCountDown = true
        // 3.请求发送验证码
        try {
          await sendSms(this.user.mobile)
          this.$toast.success('发送成功')
        } catch (error) {
          if (error.response.status === 429) {
            this.$toast('请一分钟后再试!')
          } else {
            this.$toast.fail('发送失败,请稍后再试!')
          }
        }
      } catch (error) {
        return console.log('验证失败', error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    background-color: #ededed;
    line-height: 46px;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
