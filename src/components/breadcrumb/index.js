import Breadcrumb from './Component.vue'

const BreadcrumbPlugin = {
  install(app) {
    app.component('Breadcrumb', Breadcrumb)
  },
}

export { BreadcrumbPlugin }
