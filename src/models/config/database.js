import { ArticleModel, NewsMessageModel, MemberModel, ProductModel, ProductCategoryModel, LinePointModel } from '@/models/index'

export default {
  Articles: {
    model: ArticleModel,
  },
  NewsMessages: {
    model: NewsMessageModel,
    api: 'news',
  },
  Members: {
    model: MemberModel,
    api: 'members',
  },
  Products: {
    model: ProductModel,
    api: 'products',
  },
  ProductCategories: {
    model: ProductCategoryModel,
    api: 'product-categories',
  },
  LinePoints: {
    model: LinePointModel,
    api: 'line-points',
  },
}
