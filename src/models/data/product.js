import {
  DataModel,
  ProductCategoryModel,
  ProductImageModel
} from '../index'

/**
 * @extends DataModel
 * 產品相關資訊。
 * @property {String} name 產品的名稱
 * @property {String} description 產品的說明
 * @property {Number} price 產品的價格
 * @property {Number} stock 產品的庫存
 * @property {Number} state 產品的狀態
 * @property {Number} category_id 產品所屬的類型 ID
 * @property {ProductCategoryModel} product_category 產品所屬的類型資訊
 */
export default class ProductModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.name = entity.name || ''
    this.description = entity.description || ''
    this.price = entity.price || 0
    this.stock = entity.stock || 0
    this.state = entity.state || 0
    this.category_id = entity.category_id || null
    this.product_category = new ProductCategoryModel(entity.product_category)
    this.images = entity.images ? entity.images.map(p => new ProductImageModel(p)) : []
    this.arrayModel.images = ProductImageModel
    // proto set
    this.api = entity.api || 'product'
  }
}