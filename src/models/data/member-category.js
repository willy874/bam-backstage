import {
  DataModel,
  MemberRelationModel,
  PushLogRelationModel
} from '../index'

/**
 * @extends DataModel
 * 使用者相關資訊。
 * @property {String} name 類別名稱
 * @property {String} description 類別描述
 * @property {String} color 類別顏色 [文字顏色,背景顏色]
 * @property {Boolean} selected 是否被選取
 * @property {Array<MemberRelationModel>} members 會員資料
 * @property {PushLogRelationModel} logs 產品類型的說明
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
    }
    this.arrayModel.members = MemberRelationModel
    if (entity.logs) {
      this.logs = entity.categories ? entity.logs.map(p => new PushLogRelationModel(p)) : []
    }
    this.arrayModel.logs = PushLogRelationModel
    // proto set
    this.api = entity.api || 'member-category'
  }

  readPushLogs(options = {}) {
    return this.request({
      options,
      default: {
        method: 'GET',
        url: `${this.api}/${this[this.primaryKey]}/push-logs`,
      },
      successCallback: (res) => {
        const handleData = options.responseHandler ? options.responseHandler(res.data) : this.responseHandler(res.data, options)
        this.set({
          logs: handleData
        }, options)
      }
    })
  }

  pushMessage(message = {}, options = {}) {
    options.requesHandler = () => message
    return this.request({
      options,
      default: {
        method: 'POST',
        url: `${this.api}/${this[this.primaryKey]}/push-message`,
      },
      successCallback: (res) => {
        const handleData = options.responseHandler ? options.responseHandler(res.data) : this.responseHandler(res.data, options)
        this.set({
          logs: handleData
        }, options)
      }
    })
  }
}