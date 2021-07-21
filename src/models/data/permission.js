import {
  DataModel
} from '../index'

/**
 * @extends DataModel
 * 使用者相關資訊。
 * @property {String} name
 * @property {String} description
 * @property {String} action
 */
export default class PermissionModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.name = entity.name || ''
    this.description = entity.description || ''
    this.action = entity.action || ''
    // proto set
    this.api = entity.api || 'permission'
  }
}