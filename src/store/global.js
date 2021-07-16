import config from '@/config/index'

export default {
  state: {
    lang: '',
    routes: {},
    windowInnerWidth: window.innerWidth,
    windowInnerHeight: window.innerHeight,
    iconWidth: 24,
    asideShow: window.innerWidth > config.layout.deviceSwitch,
    headerShow: false,
    nav: null
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
      window.dispatchEvent(
        new Event('toggleAside', {
          bubbles: false,
          cancelable: false,
        })
      )
      if (typeof value === 'boolean') {
        state.asideShow = value
      } else {
        state.asideShow = !state.asideShow
      }
      if (state.asideShow === false) {
        state.nav.forEach(nav => {
          nav.open = false
        })
      }
    },
    setHeaderShow(state, value) {
      if (typeof value === 'boolean') {
        state.headerShow = value
      } else {
        state.headerShow = !state.headerShow
      }
    },
    setNav(state, value) {
      state.nav = value
    },
  },
  actions: {},
}