import { DataModel } from '../index'

/**
 * @extends DataModel
 * @property {Number} id 該Model的辨識索引
 * @property {String} name 該圖片的檔案名稱
 * @property {String} image_name 該圖片的檔案名稱
 * @property {String} uuid 該圖片的唯一碼
 * @property {String} image_ext 該圖片的副檔名
 * @property {Number} sort 該圖片的排序
 * @property {String} type 該圖片的儲存類型
 * @property {Number} url 該圖片的檔案路徑
 * @property {String} image_alt 該圖片的替代文字
 * @property {String} image_title 該圖片的標題文字
 * @property {String} image_url
 * @property {String} image_base64
 * @property {String} image_blob
 */
export default class ImageModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.id = entity.id || 0
    this.name = entity.name || ''
    this.image_name = entity.image_name || ''
    this.uuid = entity.uuid || ''
    this.image_ext = entity.image_ext || ''
    this.sort = entity.sort || 0
    this.type = entity.type || ''
    this.url = entity.url || ''
    this.image_alt = entity.image_alt || ''
    this.image_title = entity.image_title || ''
    this.image_url = entity.image_url || ''
    this.image_base64 = entity.image_base64 || ''
    this.image_blob = entity.image_blob || ''
    // proto set
    this.api = entity.api || 'image'
  }
}
