import {
  DataModel
} from '../index'

/**
 * @extends DataModel
 * 使用者相關資訊。
 * @property {String} id 使用者的 uuid 資料
 * @property {String} name LINE 的使用者顯示名稱
 * @property {String} status_message LINE 狀態訊息
 * @property {String} userid LINE USER ID
 * @property {Number} line_status LINE 的狀態碼，代表被是否被封鎖
 * @property {Number} points 使用者的 LINE 點數
 * @property {String} image_url LINE 的使用者照片
 * @property {String} state 使用者啟用停用
 * @property {String} real_name 使用者的名稱
 * @property {Number} gender 使用者的性別
 * @property {String} email 使用者的電子郵件
 * @property {String} phone_number 使用者的電話號碼
 * @property {String} address 使用者的地址
 */
export default class MemberModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.id = entity.id || ''
    this.name = entity.name || ''
    this.status_message = entity.status_message || ''
    this.userid = entity.userid || ''
    this.line_status = entity.line_status || 0
    this.points = entity.points || 0
    this.image_url = entity.image_url || ''
    this.state = entity.state || 0
    this.real_name = entity.real_name || ''
    this.gender = entity.gender || null
    this.email = entity.email || ''
    this.phone_number = entity.phone_number || ''
    this.address = entity.address || ''
    this.selected = entity.selected || false
    // proto set
    this.api = entity.api || 'member'
  }
}