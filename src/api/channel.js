// 频道请求模块
// 获取所有频道列表
import request from '@/utils/request'
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}

// 设置用户的频道
export const addUserChannels = (channel) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}
