import ImageModel from './image'

/**
 * @extends ImageModel
 * @property {Boolean} select 該檔案是否被選取
 * @property {Boolean} preview 該檔案是否可預覽
 */
export default class ProductImageModel extends ImageModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.id = entity.id || 0
    this.product_id = entity.product_id || 0
    this.image_id = entity.image_id || ''
    this.api = entity.api || 'product-image'
    this.primaryKey = entity.primaryKey || 'image_id'
  }
}