<template>
  <div class="login-container">
    <!-- 页面导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录" />
    <!-- 登录表单 -->
    <van-form @submit="onSubmit">
      <van-field name="用户名" placeholder="请输入手机号">
        <i slot="left-icon" class="iconfont toutiao-shouji"></i>
      </van-field>
      <van-field type="password" name="密码" placeholder="请输入验证码">
        <i slot="left-icon" class="iconfont toutiao-yanzhengma"></i>
        <template #button>
          <van-button class="send-sms-btn" round size="small" type="default">获取验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit"> 登录 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  name: 'loginIndex',
  methods: {
    onSubmit (values) {
      console.log('submit', values)
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
  .login-btn-wrap{
    padding: 53px 33px;
    .login-btn{
        background-color: #6db4fb;
        border: none;
    }
  }
}
</style>
