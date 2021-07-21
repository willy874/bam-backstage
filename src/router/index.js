import {
  createRouter,
  createWebHistory
} from 'vue-router'
import routes from './routes'
import addRoutePermissions from './auth-routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.addRoutePermissions = addRoutePermissions

const cache = {
  to: '',
  from: '',
}

router.beforeEach((to, from) => {
  cache.to = to.meta.transition
  cache.from = from.meta.transition
  if (to.name === 'Login' || from.name === 'Login') {
    to.meta.transition = 'fade'
    from.meta.transition = 'fade'
  } else {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    from.meta.transition = toDepth < fromDepth ? 'slide-left' : 'slide-right'
  }
})

router.afterEach((to, from) => {
  to.meta.transition = cache.to
  from.meta.transition = cache.from
})

export default router