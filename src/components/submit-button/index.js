import Component from './Component.vue'

const SubmitButtonPlugin = {
  install(app) {
    app.component('SubmitButton', Component)
  },
}

export { SubmitButtonPlugin }
