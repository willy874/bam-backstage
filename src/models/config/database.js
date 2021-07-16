import {
  ArticleModel,
  MemberModel,
  ProductModel,
  ProductCategoryModel,
  LinePointModel,
  ImageAssetModel,
  RichmenuModel,
  AssetsListModel,
  RichmenusListModel,
  MemberCategoryModel,
} from '@/models/index'

export default {
  Articles: {
    model: ArticleModel,
    api: 'articles',
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
  ImageAssets: {
    listModel: AssetsListModel,
    model: ImageAssetModel,
    api: 'images',
  },
  Richmenus: {
    listModel: RichmenusListModel,
    model: RichmenuModel,
    api: 'richmenus',
  },
  MemberCategories: {
    model: MemberCategoryModel,
    api: 'member-categories',
  }
}