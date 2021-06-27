import Button from './Component.vue'

const ButtonPlugin = {
  install(app) {
    app.component('Button', Button)
  },
}

export { ButtonPlugin }
