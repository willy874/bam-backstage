import ArticleView from '../views/Article/Index.vue'
import ArticleListView from '../views/Article/List.vue'
import ArticleListProps from '../views/Article/list'
import MemberListProps from '../views/Member/list'
import ProductListProps from '../views/Product/list'
import RichmenuListProps from '../views/Richmenu/list'
import AssetListView from '../views/Asset/List.vue'
import AssetImageProps from '../views/Asset/image.js'
import {
  h
} from 'vue'

const routes = [{
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
    props: {
      routeTitle: '文章管理',
    },
    children: [{
      name: 'ArticleList',
      path: 'list',
      component: ArticleListView,
      props: ArticleListProps,
    }, ],
  },
  {
    name: 'Member',
    path: '/member',
    redirect: '/member/list',
    component: ArticleView,
    props: {
      routeTitle: '會員專區',
    },
    children: [{
      name: 'MemberList',
      path: 'list',
      component: ArticleListView,
      props: MemberListProps,
    }, ],
  },
  {
    name: 'Product',
    path: '/product',
    redirect: '/product/list',
    component: ArticleView,
    props: {
      routeTitle: '商品管理',
    },
    children: [{
      name: 'ProductList',
      path: 'list',
      component: ArticleListView,
      props: ProductListProps,
    }, ],
  },
  {
    name: 'Richmenu',
    path: '/richmenu',
    redirect: '/richmenu/list',
    component: ArticleView,
    props: {
      routeTitle: '圖文選單管理',
    },
    children: [{
      name: 'RichmenuList',
      path: 'list',
      component: ArticleListView,
      props: RichmenuListProps,
    }, ],
  },
  {
    name: 'Group',
    path: '/group',
    redirect: '/group/list',
    component: ArticleView,
    props: {
      routeTitle: '分眾管理',
    },
    children: [{
      name: 'GrouptList',
      path: 'list',
      component: ArticleListView,
      // props: MemberListProps,
    }, ],
  },
  {
    name: 'Asset',
    path: '/asset',
    redirect: '/asset/image',
    component: ArticleView,
    props: {
      routeTitle: '資源管理',
    },
    children: [{
      name: 'AssetList',
      path: 'image',
      props: AssetImageProps,
      component: AssetListView,
    }, ],
  },
  {
    name: 'Service',
    path: '/service',
    redirect: '/service/list',
    component: ArticleView,
    props: {
      routeTitle: '服務管理',
    },
    children: [{
      name: 'ServiceList',
      path: 'list',
      component: ArticleListView,
      // props: MemberListProps,
    }, ],
  },
  {
    name: 'Order',
    path: '/order',
    redirect: '/order/list',
    component: ArticleView,
    props: {
      routeTitle: '訂單管理',
    },
    children: [{
      name: 'OrderList',
      path: 'list',
      component: ArticleListView,
      // props: MemberListProps,
    }, ],
  },
  {
    name: 'Friend',
    path: '/friend',
    component: ArticleView,
    props: {},
    children: [{
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
    name: 'Setting',
    path: '/setting',
    redirect: '/setting/list',
    component: ArticleView,
    props: {
      routeTitle: '系統管理',
    },
    children: [{
      name: 'SettingList',
      path: 'list',
      component: ArticleListView,
      // props: MemberListProps,
    }, ],
  },
]

export default routes