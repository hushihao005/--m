// 请求模块
// 导入axios
import axios from 'axios'
import store from '@/store'

// 导入json-bigint 处理数据中超过js整数范围的问题
// 提供了两个方法
// 1. JSONBig.parse() == JSON.parse()
// 2. JSONBig.stringify() == JSON.stringify()
// * 两个方法都是把json格式的字符串转成Javascript对象
// * 使用时要把BigNumber类型的数据转成字符串来使用
// const jsonstr = '{ "art_id: 12345678999999855" }
// JSONBig.parse(jsonstr).art_id.toString()
import JSONBig from 'json-bigint'

const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://toutiao.itheima.net/',

  // 自定义后端返回的原始数据
  // data是后端返回的原始数据, 就是JSON格式的字符串(JSON.parse(data))
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (error) {
      return data
    }
  }]
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
