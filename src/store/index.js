import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/Storage'

Vue.use(Vuex)

// 为了方便后期访问使用 拿TOKEN_KEY去访问token等数据
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 存储的是对象,里面是token等数据
    // 3.将存储到本地的字符串形式的token通过JSON.parse转换成对象形式的再更新user里的数据,方便之后使用
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, data) {
      // 1.先通过data设置state.user的值
      state.user = data
      // 2.将此时获取到的对象形式的数据通过JSON.stringify转换成字符串形式的,再存储到本地
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
