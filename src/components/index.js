import { IconPlugin } from './icon/index'
import { TextBoxPlugin } from './text-box/index'

const ComponentPlugin = {
  install(app) {
    app.use(IconPlugin)
    app.use(TextBoxPlugin)
  },
}

export default ComponentPlugin
