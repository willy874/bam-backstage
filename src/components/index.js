import { IconPlugin } from './icon/index'
import { TextBoxPlugin } from './text-box/index'
import { DataTablePlugin } from './data-table/index'

const ComponentPlugin = {
  install(app) {
    app.use(IconPlugin)
    app.use(TextBoxPlugin)
    app.use(DataTablePlugin)
  },
}

export default ComponentPlugin
