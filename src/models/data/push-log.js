import {
  DataModel
} from '../index'

/**
 * @extends DataModel
 * 使用者相關資訊。
 * @property {String} path
 * @property {Number} status_code
 * @property {String} response
 */
export default class PushLogModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.path = entity.path || ''
    this.status_code = entity.status_code || 0
    this.response = entity.response || ''
  }
}