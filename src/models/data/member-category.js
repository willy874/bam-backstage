import {
  DataModel,
  MemberRelationModel
} from '../index'
import {
  request
} from '@/plugins/axios/request'
import {
  handleApiConfig
} from '../utility/index'

/**
 * @extends DataModel
 * 使用者相關資訊。
 * @property {String} name 類別名稱
 * @property {String} description 類別描述
 * @property {String} color 類別顏色 [文字顏色,背景顏色]
 * @property {Boolean} selected 是否被選取
 * @property {Array<MemberRelationModel>} members 會員資料
 */
export default class MemberCategoryModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.name = entity.name || ''
    this.description = entity.description || ''
    this.color = entity.color || ''
    this.selected = entity.selected || false
    this.text = entity.text || ''
    if (entity.members) {
      this.members = entity.members ? entity.members.map(p => new MemberRelationModel(p)) : []
      this.arrayModel.members = MemberRelationModel
    }
    // proto set
    this.api = entity.api || 'member-category'
  }

  readPushLogs(options = {}) {
    this.loading = true
    return new Promise((resolve, reject) => {
      request(
          handleApiConfig({
            default: {
              method: 'GET',
              url: `${this.api}/${this[this.primaryKey]}/push-logs`,
            },
            model: this,
            ...options,
          })
        )
        .then((res) => {
          this.loading = false
          const handleData = options.responseHandler ? options.responseHandler(res.data) : this.responseHandler(res.data, options)
          this.set(handleData, options)
          resolve(res)
        })
        .catch((err) => {
          this.loading = false
          reject(err)
        })
    })
  }

  pushMessage(message = {}, options = {}) {
    this.loading = true
    return new Promise((resolve, reject) => {
      request(
          handleApiConfig({
            default: {
              method: 'POST',
              url: `${this.api}/${this[this.primaryKey]}/push-message`,
            },
            model: this,
            requesHandler() {
              return message
            },
            ...options,
          })
        )
        .then((res) => {
          this.loading = false
          const handleData = options.responseHandler ? options.responseHandler.call(this, res.data) : this.responseHandler(res.data, options)
          this.set(handleData, options)
          resolve(res)
        })
        .catch((err) => {
          this.loading = false
          reject(err)
        })
    })
  }
}