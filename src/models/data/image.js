import FileModel from './file'

/**
 * @extends FileModel
 * @property {String} image_name 該圖片的檔案名稱
 * @property {String} image_ext 該圖片的副檔名
 * @property {String} image_alt 該圖片的替代文字
 * @property {String} image_title 該圖片的標題文字
 * @property {String} image_url 該圖片的路徑
 * @property {String} image_base64 該圖片的base64顯示字串
 * @property {String} image_blob 該圖片的二進位Blob檔
 * @property {Number} width 該圖片的寬度
 * @property {Number} height 該圖片的高度
 */
export default class ImageModel extends FileModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.image_name = entity.image_name || ''
    this.image_ext = entity.image_ext || ''
    this.image_alt = entity.image_alt || ''
    this.image_title = entity.image_title || ''
    this.image_url = entity.image_url || ''
    this.image_base64 = entity.image_base64 || ''
    this.image_blob = entity.image_blob || null
    this.width = entity.width || 0
    this.height = entity.height || 0
  }
}