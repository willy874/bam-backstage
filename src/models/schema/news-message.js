module.exports = {
  extends: 'ArticleModel',
  description: '',
  tebles: [
    {
      name: 'images',
      type: Array,
      itemType: 'ImageModel',
      default: '[]',
      description: '該筆文章的圖片',
    },
    {
      name: 'published_at',
      type: String,
      default: '',
      description: '該筆文章的公開時間',
    },
    {
      name: 'finished_at',
      type: String,
      default: '',
      description: '該筆文章的下架時間',
    },
  ],
}
