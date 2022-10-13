import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login/index.vue') },
  {
    path: '/',
    // name: 'layout',
    component: () => import('@/views/layout/index.vue'),
    children: [
      // 默认子路由
      { path: '', redirect: '/home' },
      { path: '/home', name: 'HomeIndex', component: () => import('@/views/home/index.vue') },
      { path: '/quest', name: 'QuestIndex', component: () => import('@/views/quest/index.vue') },
      { path: '/video', name: 'VideoIndex', component: () => import('@/views/video/index.vue') },
      { path: '/my', name: 'MyIndex', component: () => import('@/views/my/index.vue') }
    ]
  },
  { path: '/search', name: 'Search', component: () => import('@/views/search/index.vue') },
  {
  // 动态路由
    path: '/article/:articleId',
    name: 'Article',
    component: () => import('@/views/article/index.vue'),
    // 开启props 传递路由参数, 把路由参数传到组件对应的props属性里
    // *props里的属性名得是跟要传的路由参数名一致
    props: true
  },
  { path: '/user/profile', name: 'UserProfile', component: () => import('@/views/userProfile/index.vue') }
]

const router = new VueRouter({
  routes
})

export default router
