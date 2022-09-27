import Vue from 'vue'
import dayjs from 'dayjs'
// dayjs默认是英文 现在加载的是中文包
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
// 配置全局使用
dayjs.locale('zh-cn')
// dayjs()获取最新时间 年月日
dayjs().format('YYYY-MM-DD')
// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

dayjs().to(dayjs('1990-01-01')) // 31 年前
dayjs().toNow()

// 定义一个全局过滤器, 可以在任何组件的模板内使用
// 参数一是过滤器名称
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
