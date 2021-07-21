import {
  DataModel
} from '../index'

/**
 * @extends DataModel
 * 產品類型相關資訊。
 * @property {String} name 產品類型的名稱
 * @property {String} description 產品類型的說明
 */
export default class ProductCategoryModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.name = entity.name || ''
    this.description = entity.description || ''
    // proto set
    this.api = entity.api || 'product-category'
  }
}