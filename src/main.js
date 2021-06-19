import { createApp } from 'vue'
import router from './router/index'
import store from './store/index'
import { AdminPlugin } from './admin/index'
import { DatabaesPlugin } from './database/index'
import ComponentPlugin from './components/index'
import App from './App.vue'
import './style/index.css'

const awaitTime = (t) => {
  return new Promise((resolve) => {
    setTimeout(resolve, t)
  })
}

new Promise((resolve, reject) => {
  ;(async function () {
    const app = createApp(App)
    app.use(router).use(store).use(DatabaesPlugin).use(AdminPlugin).use(ComponentPlugin)
    await awaitTime(1000)
    resolve(app)
  })()
}).then((app) => {
  app.mount('#app')
})
