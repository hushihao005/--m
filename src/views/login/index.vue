<template>
  <div class="login-container">
    <!-- 页面导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录" />
    <!-- 登录表单 -->
    <van-form @submit="onSubmit">
      <van-field v-model="user.mobile" name="手机号" placeholder="请输入手机号" type="number" :rules="userFormRules.mobile" maxlength="11">
        <i slot="left-icon" class="iconfont toutiao-shouji"></i>
      </van-field>
      <van-field v-model="user.code" name="验证码" placeholder="请输入验证码" type="number" :rules="userFormRules.code" maxlength="6">
        <i slot="left-icon" class="iconfont toutiao-yanzhengma"></i>
        <template #button>
          <van-button class="send-sms-btn" round size="small" type="default"
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
import { login } from '@/api/user'
export default {
  data () {
    return {
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
      console.log(user)
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
        const res = await login(user)
        this.$toast.success('登录成功')
        console.log('登录成功', res)
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
