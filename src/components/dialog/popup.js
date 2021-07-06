import { markRaw } from 'vue'
import { v4 as uuidv4 } from 'uuid'

/**
 * @property {Number} id
 * @property {VueComponent} view
 * @property {Number} width
 * @property {Number} height
 * @property {Boolean} zIndexLock
 * @property {Boolean} positionLock 當發生 resize 時是否固定位置
 * @property {Boolean} windowRangeLimt 當發生 drag or touch 是否可以超出視窗
 */
export default class Popup {
  constructor(args) {
    const entity = args || {}
    this.id = entity.id || uuidv4()
    this.dialog = entity.dialog
    this.view = markRaw(entity.view)
    this.width = entity.width || 0
    this.height = entity.height || 0
    this.zIndexLock = entity.zIndexLock || false
    this.positionLock = entity.positionLock || false
    this.windowRangeLimt = entity.windowRangeLimt || false
    this.position = entity.position || {
      x: 'center',
      y: 'center',
    }
    this.onBackgroundClick =
      entity.onBackgroundClick ||
      (() => {
        this.close()
      })
    this.props = Object.assign(
      {
        id: this.id,
      },
      entity.props
    )
  }

  open(options) {
    Object.keys(options).forEach((key) => {
      this[key] = options[key]
    })
    this.dialog.popup(this)
  }

  close() {
    this.dialog.closePopup(this.id)
  }
}
