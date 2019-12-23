import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
    component: () => import('components/login')
  },
  {
    path: '/login',
    component: () => import('components/login')
  },
  {
    path: '/home',
    component: () => import('components/home')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const toSessionStorageToken = window.sessionStorage.getItem('token')
  if (!toSessionStorageToken) return next('/login')
  next()
})

export default router
