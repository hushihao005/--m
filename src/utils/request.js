// 请求模块
// 导入axios
import axios from 'axios'

const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://toutiao.itheima.net/'
})

// 请求拦截器

// 响应拦截器

export default request
