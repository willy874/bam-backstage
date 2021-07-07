import { DataModel } from '../index'

/**
 * @extends DataModel
 * @property {String} id 該Model的辨識索引
 * @property {String} name 該檔案的名稱
 * @property {String} type 該檔案的儲存類型
 * @property {Number} sort 該檔案的排序
 * @property {Number} size 該檔案的檔案大小
 * @property {String} blob 該檔案的二進位Blob檔
 */
export default class FileModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.id = entity.id || ''
    this.name = entity.name || ''
    this.type = entity.type || ''
    this.sort = entity.sort || 0
    this.size = entity.size || 0
    this.blob = entity.blob || null
    // proto set
    this.api = entity.api || 'file'
  }
}
