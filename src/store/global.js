import config from '@/config/index'

export default {
  state: {
    lang: '',
    routes: {},
    windowInnerWidth: window.innerWidth,
    windowInnerHeight: window.innerHeight,
    fontSize: 16,
    asideShow: window.innerWidth > config.layout.deviceSwitch,
  },
  mutations: {
    setLang(state, value) {
      state.lang = value
    },
    setRoutes(state, value) {
      state.routes = value
    },
    setWindowInnerWidth(state) {
      state.windowInnerWidth = window.innerWidth
      state.windowInnerHeight = window.innerHeight
    },
    setAsideShow(state, value) {
      if (typeof value === 'boolean') {
        state.asideShow = value
      } else {
        state.asideShow = !state.asideShow
      }
    },
  },
  actions: {},
}
