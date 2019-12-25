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
    redirect: '/welcome',
    component: () => import('components/home'),
    children: [{
      path: '/welcome',
      component: () => import('components/welcome')
    }, {
      path: '/users',
      component: () => import('views/users/list')
    }, {
      path: '/rights',
      component: () => import('views/power/rights')
    }, {
      path: '/roles',
      component: () => import('views/power/roles')
    }]
  }
]

const router = new VueRouter({
  routes
})

// 路由全局守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const toSessionStorageToken = window.sessionStorage.getItem('token')
  if (!toSessionStorageToken) return next('/login')
  next()
})

export default router
