import { createStore } from 'vuex'
import globalModule from './global'

export default createStore({
  state() {
    return {}
  },
  mutations: {},
  actions: {},
  modules: {
    global: globalModule,
  },
})
