import {
  DataModel,
  PushLogModel
} from '../index'

/**
 * @extends DataModel
 * 使用者相關資訊。
 * @property {Number} category_id 類別名稱
 * @property {Number} push_id 類別描述
 * @property {Number} success 成功數
 * @property {Number} fail 失敗數
 * @property {PushLogModel} log 推播紀錄
 */
export default class PushLogRelationModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.category_id = entity.category_id || 0
    this.push_id = entity.push_id || 0
    this.success = entity.success || 0
    this.fail = entity.fail || 0
    this.log = new PushLogModel(entity.log)
  }
}