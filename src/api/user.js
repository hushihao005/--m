// 用户登录请求模块
import request from '@/utils/request.js'
// import store from '@/store'

export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}

// 发送验证码 每手机号每分钟1次
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}

// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
    // 发送给后端的授权信息-token
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
    // 在request.js里通过请求拦截器完成了上面发送给后端的授权信息-token的操作
  })
}
