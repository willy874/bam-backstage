import { IconPlugin } from './icon/index'
import { TextBoxPlugin } from './text-box/index'
import { DataTablePlugin } from './data-table/index'
import { BreadcrumbPlugin } from './breadcrumb/index'
import { DialogPlugin } from './dialog/index'
import { ImagePlugin } from './image-viewbox/index'
import { SubmitButtonPlugin } from './submit-button/index'

const ComponentPlugin = {
  install(app) {
    app.use(IconPlugin)
    app.use(TextBoxPlugin)
    app.use(DataTablePlugin)
    app.use(BreadcrumbPlugin)
    app.use(DialogPlugin)
    app.use(ImagePlugin)
    app.use(SubmitButtonPlugin)
  },
}

export default ComponentPlugin
