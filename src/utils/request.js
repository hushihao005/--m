// 请求模块
// 导入axios
import axios from 'axios'
import store from '@/store'

const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://toutiao.itheima.net/'
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  const { user } = store.state
  if (user && user.token) {
    // 给后端发送授权信息-token
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  // 一定要返回config对象, 否则请求就到这里出不去了
  return config
}, function (error) {
  // 请求出错(还没发出去), 会进入这里
  return Promise.reject(error)
})

// 响应拦截器

export default request
