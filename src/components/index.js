import { IconPlugin } from './icon/index'
import { TextBoxPlugin } from './text-box/index'
import { DataTablePlugin } from './data-table/index'
import { BreadcrumbPlugin } from './breadcrumb/index'
import { DialogPlugin } from './dialog/index'

const ComponentPlugin = {
  install(app) {
    app.use(IconPlugin)
    app.use(TextBoxPlugin)
    app.use(DataTablePlugin)
    app.use(BreadcrumbPlugin)
    app.use(DialogPlugin)
  },
}

export default ComponentPlugin
