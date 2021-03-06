import ImageModel from './image'

/**
 * @extends ImageModel
 * @property {Number} id 該圖片的編號碼
 * @property {Number} product_id 該圖片的所屬產品
 * @property {String} image_id 該圖片的唯一碼
 */
export default class ProductImageModel extends ImageModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.id = entity.id || 0
    this.product_id = entity.product_id || 0
    this.image_id = entity.image_id || ''
    this.primaryKey = entity.primaryKey || 'image_id'
  }
}