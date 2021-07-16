import ImageModel from './image'

/**
 * @extends ImageModel
 * @property {Number} id 該圖片的編號碼
 * @property {Number} article_id 該圖片的所屬文章
 * @property {String} image_id 該圖片的唯一碼
 */
export default class ArticleImageModel extends ImageModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.id = entity.id || 0
    this.article_id = entity.article_id || 0
    this.image_id = entity.image_id || ''
    if (entity.info) {
      this.name = entity.info.name || ''
      this.height = entity.info.height || 0
      this.width = entity.info.width || 0
      this.type = entity.info.mime || ''
    }
    this.primaryKey = entity.primaryKey || 'image_id'
  }
}