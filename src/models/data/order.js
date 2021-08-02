import {
  DataModel
} from '../index'

/**
 * @extends DataModel
 * 會員相關資訊。
 * @property {String} id 會員的 uuid 資料
 */
export default class OrderModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.id = entity.id || ''
    this.member_id = entity.member_id || ''
    this.member_userid = entity.member_userid || ''
    this.member_name = entity.member_name || ''
    this.member_gender = entity.member_gender || 0
    this.member_email = entity.member_email || ''
    this.member_phone_number = entity.member_phone_number || ''
    this.member_address = entity.member_address || 0
    this.member_real_name = entity.member_real_name || ''
    this.product_id = entity.product_id || 0
    this.product_name = entity.product_name || ''
    this.product_category_name = entity.product_category_name || ''
    this.product_description = entity.product_description || ''
    this.product_price = entity.product_price || 0
    this.state = entity.state || 0
    try {
      this.product_data = JSON.parse(entity.product_data || '{}')
    } catch (error) {
      this.product_data = entity.product_data || {}
    }
    // proto set
    this.api = entity.api || 'order'
  }
}