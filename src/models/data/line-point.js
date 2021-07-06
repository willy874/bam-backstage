import { DataModel } from '../index'

/**
 * @extends DataModel
 * Line 點數相關資訊。
 * @property {Number} product_id 該點數資訊所屬的產品唯一編號
 * @property {String} number 該點數資訊的編號
 * @property {Number} state 該點數資訊的狀態
 */
export default class LinePointModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.product_id = entity.product_id || 0
    this.number = entity.number || ''
    this.state = entity.state || 0
    // proto set
    this.api = entity.api || 'line-point'
  }
}
