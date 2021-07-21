import {
  createApp
} from 'vue'
import router from './router/index'
import store from './store/index'
import {
  AdminPlugin,
  useAdmin
} from './admin/index'
import {
  DatabaesPlugin
} from './database/index'
import {
  AxiosPlugin
} from './plugins/axios/index'
import ComponentPlugin from './components/index'
import App from './App.vue'
import Mixin from './utility/mixin'
import './style/index.css'
// import './test'

new Promise(async (resolve) => {
  const app = createApp({
    mixins: [App, Mixin],
  })
  // app.config.performance = true
  // app.config.devtools = true
  app.use(router).use(store).use(DatabaesPlugin).use(AdminPlugin).use(AxiosPlugin).use(ComponentPlugin)
  const admin = useAdmin()
  await admin.autoLogin()
  resolve(app)
}).then((app) => {
  app.mount('#app')
})