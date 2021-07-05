import { ArticleModel, NewsMessageModel, MemberModel } from '@/models/index'

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
}
