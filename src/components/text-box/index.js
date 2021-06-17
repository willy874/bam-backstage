import TextBox from './Component.vue'

const TextBoxPlugin = {
  install(app) {
    app.component('TextBox', TextBox)
  },
}

export { TextBoxPlugin }
