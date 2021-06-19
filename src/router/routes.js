import ArticleView from '../views/Article/Index.vue'
import ArticleListView from '../views/Article/List.vue'
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
    name: 'Article',
    path: '/article',
    redirect: '/article/list',
    component: ArticleView,
    children: [
      {
        path: 'list',
        component: ArticleListView,
        props: {
          routeTitle: '文章列表',
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
  {
    name: 'Member',
    path: '/member',
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
  {
    name: 'News',
    path: '/news',
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
