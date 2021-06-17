import Admin from './proto'

const AdminPlugin = {
  install(app, options = {}) {
    const { globalProperties } = app.config
    options.router = globalProperties.$router
    options.store = globalProperties.$store
    const admin = new Admin(options)
    AdminPlugin.admin = admin
    globalProperties.$admin = admin
  },
}

const useDatabase = () => {
  return AdminPlugin.admin
}

export { AdminPlugin, useDatabase }
