import {
  DataModel,
  MemberModel,
  MemberCategoryModel
} from '../index'

/**
 * @extends DataModel
 * 使用者相關資訊。
 * @property {String} member_id 會員關聯 ID
 * @property {Number} category_id 類別關聯 ID
 * @property {MemberModel} member 會員資料
 * @property {MemberCategoryModel} category_info 會員分類
 */
export default class MemberRelationModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.member_id = entity.member_id || ''
    this.category_id = entity.category_id || 0
    if (entity.member) {
      this.member = new MemberModel(entity.member)
    }
    if (entity.category_info) {
      this.category_info = new MemberCategoryModel(entity.category_info)
    }
  }
}