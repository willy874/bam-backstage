import { DataModel } from '../index'

/**
 * @extends DataModel
 * @property {String} subject 該筆文章的標題
 * @property {String} content 該筆文章的內容
 * @property {String} status 該筆文章的狀態碼
 * @property {Number} sort 該筆文章的排序
 * @property {String} created_user 該筆文章建立的使用者
 * @property {String} updated_user 該筆文章最後編輯的使用者
 * @property {String} deleted_user 該筆文章刪除的使用者
 */
export default class ArticleModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.subject = entity.subject || ''
    this.content = entity.content || ''
    this.status = entity.status || '0'
    this.sort = entity.sort || 0
    this.created_user = entity.created_user || ''
    this.updated_user = entity.updated_user || ''
    this.deleted_user = entity.deleted_user || ''
    // proto set
    this.api = entity.api || 'article'
  }
}
