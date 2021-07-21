import {
  DataModel
} from '../index'

/**
 * @extends DataModel
 * @property {String} name 該管理者名稱
 * @property {Number} role_id 
 * @property {String} role_name 
 * @property {String} username 該管理者帳號
 * @property {String} password 密碼
 * @property {String} old_password 舊密碼
 * @property {String} new_password 新密碼
 * @property {String} check_password 密碼確認
 * @property {Number} is_developer 該管理者是否為開發者帳號
 */
export default class AdminModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.role_id = entity.role_id || 0
    this.role_name = entity.role_name || ''
    this.name = entity.name || ''
    this.username = entity.username || ''
    this.password = entity.password || ''
    this.old_password = entity.old_password || ''
    this.new_password = entity.new_password || ''
    this.check_password = entity.check_password || ''
    this.is_developer = entity.is_developer || false
    // proto set
    this.api = entity.api || 'admin'
  }

  updatePassword(options = {}) {
    options.requesHandler = () => {
      return {
        old_password: this.old_password,
        new_password: this.new_password
      }
    }
    return this.request({
      options,
      default: {
        method: 'PUT',
        url: `${this.api}/${this[this.primaryKey]}/password`,
      },
    })
  }
}