import {
  DataModel,
  MemberRelationModel
} from '../index'

/**
 * @extends DataModel
 * 會員相關資訊。
 * @property {String} id 會員的 uuid 資料
 * @property {String} name LINE 的會員顯示名稱
 * @property {String} status_message LINE 狀態訊息
 * @property {String} userid LINE USER ID
 * @property {Number} line_status LINE 的狀態碼，代表被是否被封鎖
 * @property {Number} points 會員的 LINE 點數
 * @property {String} image_url LINE 的會員照片
 * @property {String} state 會員啟用停用
 * @property {String} real_name 會員的名稱
 * @property {Number} gender 會員的性別
 * @property {String} email 會員的電子郵件
 * @property {String} phone_number 會員的電話號碼
 * @property {String} address 會員的地址
 * @property {Array<MemberRelationModel>} categories 會員分類的關聯資料
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
    if (entity.categories) {
      this.categories = entity.categories ? entity.categories.map(p => new MemberRelationModel(p)) : []
      this.arrayModel.categories = MemberRelationModel
    }
    // proto set
    this.api = entity.api || 'member'
  }
}