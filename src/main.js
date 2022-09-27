import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 一次性导入vant组件库
import Vant from 'vant'
// 导入vant全局样式
import 'vant/lib/index.css'

// 导入全局样式
import './styles/index.less'

// 导入 动态设置Rem基准值组件
import 'amfe-flexible'

// 导入 dayjs文件处理时间
import '@/utils/dayjs'

// 注册使用vant组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
