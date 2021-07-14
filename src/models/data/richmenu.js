import {
  DataModel,
  RichmenuOptionModel
} from '../index'

/**
 * @extends DataModel
 * 圖文選單的標籤。
 * @property {String} name 標籤的名稱
 * @property {Number} richmenu_id 標籤隸屬的圖文選單
 */
class RichmenuTagModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.name = entity.name || ''
    this.richmenu_id = entity.richmenu_id || 0
  }
}

/**
 * @extends DataModel
 * 圖文選單相關資訊。
 * @property {String} name 圖文選單的名稱
 * @property {String} description 圖文選單的說明
 * @property {Number} grid 圖文選單的分割數
 * @property {Number} richmenu_id 圖文選單在 Line 上面的唯一碼
 * @property {String} chat_bar_text 圖文選單的
 * @property {Number} state 圖文選單的狀態碼
 * @property {Array<RichmenuOptionModel>} data 圖文選單的設定資料
 * @property {Array<RichmenuTagModel>} tags 圖文選單的標籤
 */
export default class RichmenuModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.name = entity.name || ''
    this.description = entity.description || ''
    this.grid = entity.grid || ''
    this.richmenu_id = entity.richmenu_id || ''
    this.chat_bar_text = entity.chat_bar_text || ''
    this.state = entity.state || ''
    this.data = entity.data ? entity.data.map(p => new RichmenuOptionModel(p)) : []
    this.arrayModel.data = RichmenuOptionModel
    this.tags = entity.tags ? entity.tags.map(p => new RichmenuTagModel(p)) : []
    this.arrayModel.tags = RichmenuTagModel
    // proto set
    this.api = entity.api || 'richmenu'
  }


  syncMenu() {
    return new Promise((resolve, reject) => {})
  }

  uploadMenu() {
    return new Promise((resolve, reject) => {})
  }

  setDefaultMenu() {
    return new Promise((resolve, reject) => {})
  }
}