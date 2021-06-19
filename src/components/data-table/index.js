import DataTable from './Component.vue'

const DataTablePlugin = {
  install(app) {
    app.component('DataTable', DataTable)
  },
}

export { DataTablePlugin }
