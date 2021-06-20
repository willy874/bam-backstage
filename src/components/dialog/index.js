import Popup from './popup'
import DialogComponent from './DialogComponent.vue'

const DialogPlugin = {
  install(app) {
    const { globalProperties } = app.config
    DialogPlugin.dialog = DialogComponent.dialog
    globalProperties.$dialog = DialogComponent.dialog
    app.component('Dialog', DialogComponent)
  },
}

const useDialog = () => {
  return DialogPlugin.dialog
}

export { DialogPlugin, useDialog, Popup }
