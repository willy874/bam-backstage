import {
  DataModel,
  MemberRelationModel
} from '../index'

/**
 * @extends DataModel
 * 使用者相關資訊。
 * @property {String} name 類別名稱
 */
export default class MemberCategoryModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.name = entity.name || ''
    this.description = entity.description || ''
    this.color = entity.color || ''
    this.selected = entity.selected || false
    this.members = entity.members ? entity.members.map(p => new MemberRelationModel(p)) : []
    this.arrayModel.members = MemberRelationModel
    // proto set
    this.api = entity.api || 'member-category'
  }
}