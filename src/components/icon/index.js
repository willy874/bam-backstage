import Icon from './Component'

const IconPlugin = {
  install(app) {
    app.component('Icon', Icon)
  },
}

export { IconPlugin }
