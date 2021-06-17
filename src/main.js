import { createApp } from 'vue'
import router from './router/index'
import store from './store/index'
import { AdminPlugin } from './admin/index'
import { DatabaesPlugin } from './database/index'
import ComponentPlugin from './components/index'
import App from './App.vue'
import './style/index.css'

new Promise((resolve, reject) => {
  const app = createApp(App)
  app.use(router).use(store).use(DatabaesPlugin).use(AdminPlugin).use(ComponentPlugin)
  resolve(app)
}).then((app) => {
  app.mount('#app')
})
