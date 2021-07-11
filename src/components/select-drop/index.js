import SelectDrop from './Component.vue'

const SelectDropPlugin = {
  install(app) {
    app.component('SelectDrop', SelectDrop)
  },
}

export {
  SelectDropPlugin
}