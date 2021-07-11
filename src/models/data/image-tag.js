import {
  DataModel
} from '../index'
/**
 * @extends DataModel
 * @property {String} name 該標籤的名稱
 * @property {String} image_id 該標籤的所屬圖片唯一碼
 */
export default class ImageTagModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.name = entity.name || ''
    this.image_id = entity.image_id || ''
  }
}