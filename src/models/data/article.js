import {
  DataModel,
  ArticleImageModel
} from '../index'

/**
 * @extends DataModel
 * @property {String} category 該筆文章的類型
 * faq: 問與答
 * news: 最新消息
 * @property {String} subject 該筆文章的標題
 * @property {String} content 該筆文章的內容
 * @property {Number} status 該筆文章的狀態碼
 * @property {String} image_id 該筆文章的封面圖片
 * @property {String} images 該筆文章的內文圖片
 */
export default class ArticleModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.category = entity.category || ''
    this.title = entity.title || ''
    this.sub_title = entity.sub_title || ''
    this.content = entity.content || ''
    this.state = entity.state || 0
    this.image_id = entity.image_id || ''
    this.images = entity.images ? entity.images.map(p => new ArticleImageModel(p)) : []
    this.arrayModel.images = ArticleImageModel
    // proto set
    this.api = entity.api || 'article'
  }
}