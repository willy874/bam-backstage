import Databaes from './proto'

const DatabaesPlugin = {
  install(app, options = {}) {
    const { globalProperties } = app.config
    options.router = globalProperties.$router
    options.store = globalProperties.$store
    const db = new Databaes(options)
    DatabaesPlugin.db = db
    globalProperties.$db = db
  },
}

const useDatabase = () => {
  return DatabaesPlugin.db
}

export { DatabaesPlugin, useDatabase }
