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
  { path: '/search', name: 'Search', component: () => import('@/views/search/index.vue') }
]

const router = new VueRouter({
  routes
})

export default router
