import axios from 'axios'

const AxiosPlugin = {
  install(app, options = {}) {
    const {
      globalProperties
    } = app.config
    axios.router = globalProperties.$router
    axios.store = globalProperties.$store
    globalProperties.$axios = axios
  },
}

export {
  AxiosPlugin
}