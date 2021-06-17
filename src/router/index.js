import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const cache = {
  to: '',
  from: '',
}

router.beforeEach((to, from) => {
  cache.to = to.meta.transition
  cache.from = from.meta.transition
  // if (to.name === 'Login' || from.name === 'Login') {
  //   to.meta.transition = 'fade'
  //   from.meta.transition = 'fade'
  // }
})

router.afterEach((to, from) => {
  to.meta.transition = cache.to
  from.meta.transition = cache.from
  // const toDepth = to.path.split('/').length
  // const fromDepth = from.path.split('/').length
  // to.meta.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
export default router
