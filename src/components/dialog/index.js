import Popup from './popup'
import DialogComponent from './DialogComponent.vue'
import useDialog from './use'

const DialogPlugin = {
  install(app) {
    const { globalProperties } = app.config
    DialogPlugin.dialog = useDialog()
    globalProperties.$dialog = useDialog()
    app.component('Dialog', DialogComponent)
  },
}

export { DialogPlugin, useDialog, Popup }
