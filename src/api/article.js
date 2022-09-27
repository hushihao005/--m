import request from '@/utils/request'
// 文章列表请求接口
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params: params
  })
}
