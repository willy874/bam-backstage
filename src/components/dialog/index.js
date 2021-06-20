import Popup from './popup'
import VueDialog from './dialog-component'

const DialogPlugin = {
  install(app) {
    const { globalProperties } = app.config
    DialogPlugin.dialog = VueDialog.dialog
    globalProperties.$dialog = VueDialog.dialog
    app.component('Dialog', VueDialog)
  },
}

const useDialog = () => {
  return DialogPlugin.dialog
}

export { DialogPlugin, useDialog, Popup }
