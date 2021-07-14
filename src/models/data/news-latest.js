import { ArticleModel, ImageModel } from '../index'

/**
 * @extends ArticleModel
 * @property {Array.<ImageModel>} images 該筆文章的圖片
 * @property {String} published_at 該筆文章的公開時間
 * @property {String} finished_at 該筆文章的下架時間
 */
export default class NewsMessageModel extends ArticleModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.images = entity.images ? entity.images.map(p => new ImageModel(p)) : []
    this.arrayModel.images = ImageModel
    this.published_at = entity.published_at || ''
    this.finished_at = entity.finished_at || ''
    // proto set
    this.api = entity.api || 'news-message'
  }
}
