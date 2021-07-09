import {
  createStore
} from 'vuex'
import globalModule from './global'
import modelModule from './model'

export default createStore({
  state() {
    return {}
  },
  mutations: {},
  actions: {},
  modules: {
    global: globalModule,
    model: modelModule,
  },
})