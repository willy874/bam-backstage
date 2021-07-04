import ArticleView from '../views/Article/Index.vue'
import ArticleListView from '../views/Article/List.vue'
import NewsListProps from '../views/News/list'
import MemberListProps from '../views/Member/list'
import { h } from 'vue'

const routes = [
  {
    name: 'Home',
    path: '/',
    component: () => import('../views/Dashboard/Index.vue'),
    props: {},
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('../views/Login/Index.vue'),
    props: {},
    meta: {
      transition: 'fade',
    },
  },
  {
    name: 'News',
    path: '/news',
    redirect: '/news/list',
    component: ArticleView,
    props: {
      routeTitle: '最新消息',
    },
    children: [
      {
        name: 'NewsList',
        path: 'list',
        component: ArticleListView,
        props: NewsListProps,
      },
    ],
  },
  {
    name: 'Member',
    path: '/member',
    redirect: '/member/list',
    component: ArticleView,
    props: {
      routeTitle: '會員專區',
    },
    children: [
      {
        name: 'MemberList',
        path: 'list',
        component: ArticleListView,
        props: MemberListProps,
      },
    ],
  },
  {
    name: 'Friend',
    path: '/friend',
    component: ArticleView,
    props: {},
    children: [
      {
        path: '',
        component: {
          render() {
            return h('div', 'List')
          },
        },
      },
      {
        path: ':id',
        component: {
          render() {
            return h('div', 'Detail')
          },
        },
      },
    ],
  },
]

export default routes
