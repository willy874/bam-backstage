import {
  DataModel,
  PermissionModel
} from '../index'

/**
 * @extends DataModel
 * 使用者相關資訊。
 * @property {String} name
 * @property {String} description
 * @property {Array<PermissionModel>} permissions
 */
export default class Role extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.name = entity.name || ''
    this.description = entity.description || ''
    this.permissions = entity.permissions ? entity.permissions.map(p => new PermissionModel(p)) : []
    this.arrayModel.permissions = PermissionModel
    // proto set
    this.api = entity.api || 'role'
  }
}